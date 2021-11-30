/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RegisterUserParams } from 'types/services/user';
import { ApolloError } from 'apollo-server-errors';
import User from 'models/User';
import ERROR_MESSAGES from 'constants/errorMessages';
import Profile from 'models/Profile';
import github from 'services/github';

export const registerUser: RegisterUserParams = async args => {
  const profileId = await github.getProfileId(args.nickname);
  const user = await User.findOne({ email: args.email, githubId: profileId });

  if (user) {
    throw new ApolloError('User already exists');
  }

  const id = new mongoose.Types.ObjectId();

  const _user = new User({
    _id: id,
    email: args.email,
    githubId: profileId,
    token: jwt.sign({ _id: id }, process.env.JWT_KEY)
  });

  const data = await _user.save();

  return data;
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

  const { profileStatus, _id, name, email, token } = updatedUser;

  return { _id, name, email, token, profileStatus };
};

export const auth = async ({ userId, token }) => {
  try {
    const user = await User.findOne({ _id: userId, token });

    if (!user) {
      throw new Error(ERROR_MESSAGES.AUTHENTICATION_FAILED);
    }
    return user.profileStatus;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.AUTHENTICATION_FAILED);
  }
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

export const saveUserConfig = async ({
  user,
  maxDistance,
  searchLoveAgeRange,
  searchFriendAgeRange,
  searchLoveGenre,
  searchFriendGenre,
  profileStatus,
  plan
}) => {
  try {
    await Profile.findOne({ _id: user._id });
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          'configs.love.range': searchLoveAgeRange,
          'configs.friendShip.range': searchFriendAgeRange,
          'configs.love.genre': searchLoveGenre,
          'configs.friendShip.genre': searchFriendGenre,
          'configs.maxDistance': maxDistance || 100
        },
        profileStatus,
        plan: plan || 'MERCURIO'
      }
    );
  } catch (error) {
    throw new Error(error);
  }

  return true;
};
