import { ApolloError } from 'apollo-server-express';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import moment from 'moment';
import mongoose from 'mongoose';
import Profile from '../models/Profile';
import bucket from '../storage';
import ERROR_MESSAGES from '../constants/errorMessages';
import { getAstral } from './astrology';
import { datetimeToBrasiliaUtc, formatUtcOffset } from '../util';
import { getUnlikesByUserId } from './unlike';
import { getLikesByUserId } from './like';
import { getCitieById } from './google-apis';
import { updateAstral } from './astral';

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

export const updateProfile = async args => {
  const {
    user,
    name,
    birthday,
    birthplace,
    occupation,
    eyes,
    genre,
    graduation,
    residence,
    sexualOrientations
  } = args;

  const { lat, lng, UTC, placeId } = await getCitieById(birthplace.placeId);

  const formattedBirthDate = datetimeToBrasiliaUtc(birthday);

  const { chart_id: chartId, zodiac, instinto, mandala } = await getAstral({
    name,
    birthdate: new Date(formattedBirthDate),
    latitude: lat,
    longitude: lng,
    birthplaceFuso: formatUtcOffset(UTC)
  });

  const databaseChartId = await updateAstral({ chartId, zodiac, instinto, mandala });

  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: user._id },
      {
        name,
        birthday: new Date(formattedBirthDate),
        astral: databaseChartId,
        birthplace: {
          description: birthplace.description,
          placeId,
          lat,
          lng
        },
        occupation,
        eyes,
        sexualOrientations,
        genre,
        graduation: {
          ...graduation,
          placeId: graduation?.description?.length === 0 ? null : graduation?.placeId
        },
        residence: {
          ...residence,
          placeId: residence?.description?.length === 0 ? null : residence?.placeId
        }
      },
      { new: true, upsert: true }
    );

    return profile;
  } catch (error) {
    throw new ApolloError(error);
  }
};

const getWantedGenres = ({ userFavoriteGenre }) => {
  if (userFavoriteGenre === 'ALL') {
    return ['MAN', 'WOMAN', 'HUMAN'];
  }
  return [userFavoriteGenre];
};

export const getProfiles = async ({ user, searchType }) => {
  const {
    _id,
    configs: { maxDistance, love, friendShip }
  } = user;
  const {
    loc: { coordinates }
  } = await Profile.findOne({ _id: user._id }, { loc: 1, _id: 0 });

  const profilesUnlikedByUser = await getUnlikesByUserId({ userId: _id, type: searchType });
  const profilesLikedByUser = await getLikesByUserId({ userId: _id, type: searchType });
  const wantedGenres = getWantedGenres({
    userFavoriteGenre: searchType === 'LOVE' ? love.genre : friendShip.genre
  });
  const startAge = searchType === 'LOVE' ? love.range[0] : friendShip.range[0];
  const endAge = searchType === 'LOVE' ? love.range[1] : friendShip.range[1];
  const startBirthday = moment()
    .subtract(startAge, 'years')
    .toISOString();
  const endBirthDay = moment()
    .subtract(endAge, 'years')
    .toISOString();

  const profiles = await Profile.find({
    $and: [
      { _id: { $nin: [...profilesUnlikedByUser, ...profilesLikedByUser, _id] } },
      {
        loc: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates
            },
            $maxDistance: maxDistance * 1110.12
          }
        }
      },
      { genre: { $in: [...wantedGenres] } },
      {
        birthday: {
          $gte: endBirthDay,
          $lt: startBirthday
        }
      }
    ]
  })
    .populate({ path: 'astral', model: 'Astral' })
    .exec();

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
