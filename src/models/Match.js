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
      required: false
    },
    receiver_id: {
      type: String,
      required: false
    },
    sentAt: {
      type: Date,
      required: false
    },
    text: {
      type: String,
      required: false
    },
    viewed: {
      type: Boolean,
      required: false
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
