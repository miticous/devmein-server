/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import validator from 'validator';
import { TextTypes } from './Astral';

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
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
  },
  plan: {
    type: String,
    enum: TextTypes,
    default: 'MERCURIO',
    required: true
  }
});

const User = mongoose.model('User', userSchema);

export default User;
