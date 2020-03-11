/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import validator from 'validator';
import moment from 'moment-timezone';
import { AUTHORIZED_USER_AGE } from '../constants';
import ERROR_MESSAGES from '../constants/errorMessages';

const authorizedUserAge = () =>
  moment(Date.now(), 'America/Sao_Paulo')
    .subtract(AUTHORIZED_USER_AGE, 'year')
    .add(1, 'day')
    .toString();

export const profileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  birthday: {
    type: Date,
    required: true,
    validate: value => {
      if (validator.isAfter(value.toString(), authorizedUserAge())) {
        throw new Error(ERROR_MESSAGES.USER_AGE_NOT_AUTHORIZED);
      }
    }
  },
  images: [
    {
      image: {
        type: String,
        required: false
      }
    }
  ],
  loc: {
    type: {
      type: String
    },
    coordinates: []
  },
  birthplace: {
    placeId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    lng: {
      type: String,
      required: true
    }
  },
  genre: {
    type: String,
    required: true,
    validate: value => {
      if (value !== 'MALE' && value !== 'FEMALE') {
        throw new Error('Undefined genre is not alowed');
      }
    },
    default: ''
  },
  astralIndexes: {
    type: String,
    required: true
  }
});

profileSchema.index({ loc: '2dsphere' });

profileSchema.methods.addProfileImage = async function(imageUrl) {
  const image = this.images[0];

  this.images = [{ _id: image._id, image: imageUrl }];
  await this.save();
};

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
