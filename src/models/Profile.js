/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import validator from 'validator';
import moment from 'moment-timezone';
import { AUTHORIZED_USER_AGE } from '../constants';
import ERROR_MESSAGES from '../constants/errorMessages';
import { TextTypes } from './Astral';

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
      _id: mongoose.Schema.Types.ObjectId,
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
    enum: ['WOMAN', 'MAN', 'HUMAN'],
    required: true
  },
  sexualOrientations: [
    {
      type: String,
      enum: [
        'HETERO',
        'GAY',
        'LESBIAN',
        'BISEXUAL',
        'ASEXUAL',
        'DEMISEXUAL',
        'PANSEXUAL',
        'QUEER',
        'QUESTIONING',
        'OTHER'
      ],
      required: true
    }
  ],
  astral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Astral'
  },
  eyes: {
    type: String,
    required: true
  },
  graduation: {
    class: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    placeId: {
      type: String,
      required: true
    }
  },
  occupation: {
    type: String,
    required: true
  },
  residence: {
    description: {
      type: String,
      required: true
    },
    placeId: {
      type: String,
      required: true
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  shownTexts: [
    {
      type: String,
      enum: TextTypes,
      default: [...TextTypes],
      required: true
    }
  ]
});

profileSchema.index({ loc: '2dsphere' });

profileSchema.methods.addProfileImage = async function(imageUrl) {
  const image = this.images[0];

  this.images = [{ _id: image._id, image: imageUrl }];
  await this.save();
};

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
