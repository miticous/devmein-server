/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import moment from 'moment';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import Profile from '../models/Profile';
import bucket from '../storage';
import ERROR_MESSAGES from '../constants/errorMessages';

const uploadProfileImages = async (file, filename) => {
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
  const { authorization, name, birthday, file, filename } = args;
  const token = authorization.replace('Bearer ', '');
  const data = jwt.verify(token, process.env.JWT_KEY);

  const imageUrl = await uploadProfileImages(file, filename);

  const profile = new Profile({
    _id: data._id,
    name,
    birthday: moment(new Date(birthday))
      .subtract(3, 'hours')
      .toString(),
    images: [{ image: imageUrl }]
  });

  try {
    const user = await profile.save();
    console.log(`✅ New user has been created with name ${user.name}`);
  } catch (error) {
    if (error.toString().includes('E11000')) {
      throw new ApolloError(ERROR_MESSAGES.PROFILE_ALREADY_EXISTS);
    }
    throw new ApolloError(error);
  }
};
