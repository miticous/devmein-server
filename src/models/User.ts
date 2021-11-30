/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { User } from 'types/models/user';
import validator from 'validator';

const userSchema = new mongoose.Schema<User>({
  _id: mongoose.Schema.Types.ObjectId,
  githubId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email address');
      }
    }
  },
  token: {
    type: String,
    required: true
  },
  profileStatus: {
    type: String,
    enum: ['PENDING', 'CREATION', 'COMPLETED'],
    required: true,
    default: 'PENDING'
  },
  configs: {
    maxDistance: {
      type: Number,
      required: true,
      default: 100
    },
    love: {
      range: [Number],
      genre: {
        type: String,
        enum: ['WOMAN', 'MAN', 'ALL'],
        required: false
      }
    },
    friendShip: {
      range: [Number],
      genre: {
        type: String,
        enum: ['WOMAN', 'MAN', 'ALL'],
        required: false
      }
    }
  }
  // TODO
  // plan: {
  //   type: String,
  //   enum: ['MERCURIO', 'JUPITER'],
  //   default: 'MERCURIO',
  //   required: true
  // }
});

const User = mongoose.model<User>('User', userSchema);

export default User;
