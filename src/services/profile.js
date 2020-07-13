import { ApolloError } from 'apollo-server-express';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Profile from '../models/Profile';
import bucket from '../storage';
import ERROR_MESSAGES from '../constants/errorMessages';
import { getAstralMapIndexes } from './astrology';
import { datetimeToBrasiliaUtc, formatUtcOffset } from '../util';
import { getUnlikesByUserId } from './unlike';
import { getLikesByUserId } from './like';
import { getCitieById } from './google-apis';

const uploadProfileImages = async ({ file, filename }) => {
  const tempPath = path.join(__dirname, './', filename);

  await writeFileSync(tempPath, file, 'base64', () => {
    throw new ApolloError(ERROR_MESSAGES.TEMP_IMAGE_SAVE_FAILED);
  });
  await bucket.upload(tempPath);
  await unlinkSync(tempPath, err => {
    if (err) {
      throw new ApolloError(ERROR_MESSAGES.TEMP_IMAGE_DELETE_FAILED);
    }
    return true;
  });

  return `https://firebasestorage.googleapis.com/v0/b/jintou-d0ad5.appspot.com/o/${filename}?alt=media&token`;
};

export const editProfile = async args => {
  const { user, name, birthday, birthplace, occupation, eyes, graduation, residence } = args;
  const { lat, lng, UTC, placeId } = await getCitieById(birthplace.placeId);

  const formattedBirthDate = datetimeToBrasiliaUtc(birthday);

  const { zodiac, instinto } = await getAstralMapIndexes({
    name,
    birthdate: new Date(formattedBirthDate),
    latitude: lat,
    longitude: lng,
    birthplaceFuso: formatUtcOffset(UTC)
  });

  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: user._id },
      {
        name,
        birthday: formattedBirthDate,
        astralIndexes: instinto,
        sign: zodiac,
        birthplace: {
          description: birthplace.description,
          placeId,
          lat,
          lng
        },
        occupation,
        eyes,
        graduation: {
          ...graduation,
          placeId: graduation.description.length === 0 ? null : graduation.placeId
        },
        residence: {
          ...residence,
          placeId: residence.description.length === 0 ? null : residence.placeId
        }
      },
      { new: true, upsert: true }
    );

    return profile;
  } catch (error) {
    throw new ApolloError(error);
  }
};

const getProfilesWithConditions = async ({ interactions, maxDistance, userLocation, genre }) => {
  const profiles = await Profile.find({
    $and: [
      {
        _id: { $nin: interactions },
        loc: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: userLocation
            },
            $maxDistance: maxDistance * 1110.12 || 100
          }
        },
        genre
      }
    ]
  });
  return profiles;
};

export const getProfilesToHome = async ({ user }) => {
  const {
    _id,
    configs: { maxDistance, searchGenre }
  } = user;
  const {
    loc: { coordinates }
  } = await Profile.findOne({ _id: user._id }, { loc: 1, _id: 0 });

  const profilesUnlikedByUser = await getUnlikesByUserId({ userId: _id });
  const profilesLikedByUser = await getLikesByUserId({ userId: _id });

  const profiles = await getProfilesWithConditions({
    interactions: [...profilesUnlikedByUser, ...profilesLikedByUser, _id],
    userLocation: coordinates,
    maxDistance,
    genre: searchGenre
  });

  return profiles;
};

export const updateProfileLocation = async ({ latitude, longitude, userId }) => {
  await Profile.findOneAndUpdate(
    { _id: userId },
    {
      loc: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    },
    { new: true, upsert: true }
  );
};

export const addProfileImage = async ({ user, file }) => {
  const imageId = new mongoose.Types.ObjectId();
  const imageName = `${user._id}.${imageId}.png`;
  const imageLink = `https://firebasestorage.googleapis.com/v0/b/jintou-d0ad5.appspot.com/o/${imageName}?alt=media&token`;

  try {
    await uploadProfileImages({ file, filename: imageName });
    await Profile.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { images: { _id: imageId, image: imageLink } } },
      { new: true, upsert: true }
    );

    return true;
  } catch (error) {
    await Profile.findOneAndUpdate(
      { _id: user._id },
      { $pull: { images: { _id: imageId, image: imageLink } } },
      { new: true, upsert: true }
    );
    await bucket.file(imageName).delete();
    return false;
  }
};

export const removeProfileImage = async ({ user, imageId }) => {
  const { images } = await Profile.findOne({ _id: user._id });
  const isUserImageOwner = images.find(image => image.image.includes(user._id));
  const imageName = `${user._id}.${imageId}.png`;

  try {
    if (isUserImageOwner) {
      await Profile.findOneAndUpdate(
        { _id: user._id },
        { $pull: { images: { _id: imageId } } },
        { new: true, upsert: true }
      );
      await bucket.file(imageName).delete();

      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};
