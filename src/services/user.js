import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import ERROR_MESSAGES from '../constants/errorMessages';

export const registerUser = async args => {
  const encryptedPassword = await bcrypt.hash(args.password, 8);
  const id = new mongoose.Types.ObjectId();
  const user = new User({
    _id: id,
    ...args,
    password: encryptedPassword,
    token: jwt.sign({ _id: id }, process.env.JWT_KEY)
  });
  const data = await user.save().catch(err => {
    if (err.errmsg) {
      return { error: ERROR_MESSAGES.USER_ALREADY_EXISTS };
    }
    if (err.message) {
      return { error: ERROR_MESSAGES.INVALID_DATA_FIELDS };
    }
    return err;
  });

  return data;
};

export const login = async args => {
  const user = await User.findOne({ email: args.email });

  if (!user) {
    return { error: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD };
  }
  const isValidPassword = await bcrypt.compare(args.password, user.password);

  if (!isValidPassword) {
    return { error: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD };
  }
  return user;
};
