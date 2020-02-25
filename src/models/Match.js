import mongoose from 'mongoose';
import { profileSchema } from './Profile';
import { getServerDate } from '../util';

const matchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false,
    default: () => getServerDate()
  },
  matches: [profileSchema],
  lastMessage: {
    sender_id: {
      type: String,
      required: true
    },
    receiver_id: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      required: true,
      default: () => getServerDate()
    },
    text: {
      type: String,
      required: true
    },
    viewed: {
      type: Boolean,
      required: true,
      default: false
    }
  }
});

matchSchema.pre('save', function() {
  if (!this.chat) {
    this.chat = null;
  }
  if (!this._id) {
    const id = new mongoose.Types.ObjectId();
    this._id = id;
  }
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
