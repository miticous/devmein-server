/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import ERROR_MESSAGES from '../constants/errorMessages';

export const registerUser = async args => {
  try {
    const encryptedPassword = await bcrypt.hash(args.password.toString(), 8);
    const id = new mongoose.Types.ObjectId();
    const user = new User({
      _id: id,
      email: args.email,
      password: encryptedPassword,
      token: jwt.sign({ _id: id }, process.env.JWT_KEY)
    });

    const data = await user.save();

    return data;
  } catch (error) {
    throw new Error('User already exists');
  }
};

export const login = async args => {
  const user = await User.findOne({ email: args.email });

  if (!user) {
    throw ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD;
  }
  const isValidPassword = await bcrypt.compare(args.password.toString(), user.password.toString());

  if (!isValidPassword) {
    throw ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD;
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      token: jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    },
    { new: true }
  );

  const { hasProfile, _id, name, email, token } = updatedUser;

  return { _id, name, email, token, hasProfile };
};

export const auth = async ({ userId, token }) => {
  const user = await User.findOne({ _id: userId, token });

  if (!user) {
    throw ERROR_MESSAGES.AUTHENTICATION_FAILED;
  }
  return user.hasProfile;
};

export const logout = async token => {
  if (!token) {
    throw ERROR_MESSAGES.LOGOUT_FAILED;
  }
  const data = jwt.verify(token, process.env.JWT_KEY);

  if (!data) {
    throw ERROR_MESSAGES.LOGOUT_FAILED;
  }
  const user = await User.findByIdAndUpdate(
    data._id,
    {
      token: null
    },
    {
      new: true
    }
  );

  if (!user) {
    throw ERROR_MESSAGES.LOGOUT_FAILED;
  }
  return true;
};
