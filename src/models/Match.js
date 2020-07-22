import mongoose from 'mongoose';
import { getServerDate } from '../util';

const matchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false,
    default: () => getServerDate()
  },
  matches: [
    {
      _id: mongoose.Schema.Types.ObjectId
    }
  ],
  unreadMessages: {
    type: Number,
    required: true,
    default: 0
  },
  lastMessage: {
    senderId: {
      type: String,
      required: false
    },
    receiverId: {
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
    }
  },
  type: {
    type: String,
    enum: ['LOVE', 'FRIENDSHIP', 'BOTH'],
    required: true
  }
});

matchSchema.pre('save', function() {
  if (!this._id) {
    const id = new mongoose.Types.ObjectId();
    this._id = id;
  }
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
