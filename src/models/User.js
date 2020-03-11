/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import validator from 'validator';

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
  hasProfile: {
    type: Boolean,
    required: true,
    default: false
  },
  configs: {
    maxDistance: {
      type: Number,
      required: false,
      default: 100
    },
    searchGenre: {
      type: String,
      required: false,
      default: ''
    }
  }
});

const User = mongoose.model('User', userSchema);

export default User;
