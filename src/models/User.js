/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
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
  }
});

const User = mongoose.model('User', userSchema);

export default User;
