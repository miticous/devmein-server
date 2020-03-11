import { ApolloError } from 'apollo-server-express';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import Profile from '../models/Profile';
import bucket from '../storage';
import ERROR_MESSAGES from '../constants/errorMessages';
import User from '../models/User';
import Like from '../models/Like';
import { getAstralMapIndexes } from './astrology';
import { datetimeToBrasiliaUtc, formatUtcOffset } from '../util';

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

export const createProfile = async args => {
  const { user, name, birthday, file, fileExtension, input } = args;
  const { _id: userId, hasProfile } = user;
  const { lat, lng, UTC } = input;

  if (hasProfile) {
    throw new ApolloError(ERROR_MESSAGES.PROFILE_ALREADY_EXISTS);
  }

  const formattedBirthDate = datetimeToBrasiliaUtc(birthday);

  const astralIndexes = await getAstralMapIndexes({
    name,
    birthdate: new Date(formattedBirthDate),
    latitude: lat,
    longitude: lng,
    birthplaceFuso: formatUtcOffset(UTC)
  });

  try {
    const profile = new Profile({
      _id: userId,
      name,
      birthday: formattedBirthDate,
      images: [{ image: '' }],
      astralIndexes: astralIndexes.join(' '),
      birthplace: {
        ...input
      }
    });

    const { images } = await profile.save();

    const imageId = images[0]._id;
    const filename = `${userId}.${imageId}.${fileExtension || 'png'}`;

    const imageUrl = await uploadProfileImages({ file, filename });

    await profile.addProfileImage(imageUrl);

    await User.findByIdAndUpdate(userId, {
      hasProfile: true
    });

    return profile;
  } catch (error) {
    if (error.toString().includes('E11000')) {
      throw new ApolloError(ERROR_MESSAGES.PROFILE_ALREADY_EXISTS);
    }
    throw new ApolloError(error);
  }
};

export const getProfilesToHome = async ({ userId, maxDistance }) => {
  const profilesIdsLikedByUser = await Like.findOne({ _id: userId }, { likes: 1, _id: 0 });
  const {
    loc: { coordinates }
  } = await Profile.findOne({ _id: userId }, { loc: 1, _id: 0 });

  const condition =
    profilesIdsLikedByUser && profilesIdsLikedByUser.likes.length > 0
      ? [...profilesIdsLikedByUser.likes.map(like => like._id), userId]
      : [userId];

  const profiles = await Profile.find({
    $and: [
      {
        _id: { $nin: condition },
        loc: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates
            },
            $maxDistance: maxDistance * 1110.12 || 100
          }
        }
      }
    ]
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
