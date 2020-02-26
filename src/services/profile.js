/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import Profile from '../models/Profile';
import bucket from '../storage';
import ERROR_MESSAGES from '../constants/errorMessages';
import User from '../models/User';
import Like from '../models/Like';

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
  const { authorization, name, birthday, file, fileExtension } = args;
  const token = authorization.replace('Bearer ', '');

  try {
    const { _id: userId } = jwt.verify(token, process.env.JWT_KEY);
    const profile = new Profile({
      _id: userId,
      name,
      birthday: moment(new Date(birthday))
        .subtract(3, 'hours')
        .toString(),
      images: [{ image: '' }]
    });
    const { images } = await profile.save();
    const imageId = images[0]._id;
    const filename = `${userId}.${imageId}.${fileExtension || 'png'}`;
    const imageUrl = await uploadProfileImages({ file, filename });

    await profile.addProfileImage(imageUrl);
    await User.findByIdAndUpdate(userId, {
      hasProfile: true
    });
    console.log(`✅ New user has been created with name ${profile.name}`);
    return profile;
  } catch (error) {
    if (error.toString().includes('E11000')) {
      throw new ApolloError(ERROR_MESSAGES.PROFILE_ALREADY_EXISTS);
    }
    throw new ApolloError(error);
  }
};

export const getProfilesToHome = async ({ userId }) => {
  const profilesIdsLikedByUser = await Like.findOne({ _id: userId }, { likes: 1, _id: 0 });

  const profilesNotLikedByUser = await Profile.find({
    _id: { $nin: [...profilesIdsLikedByUser.likes, userId] }
  });

  return profilesNotLikedByUser;
};
