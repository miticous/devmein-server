import mongoose from 'mongoose';
import { profileSchema } from './Profile';
import { chatSchema } from './Chat';
import { getServerDate } from '../util';

const matchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false
  },
  matches: [profileSchema],
  chat: chatSchema
});

matchSchema.pre('save', function() {
  if (!this.chat) {
    this.chat = null;
  }
  if (!this._id) {
    const id = new mongoose.Types.ObjectId();
    this._id = id;
  }
  if (!this.startedAt) {
    this.startedAt = getServerDate();
  }
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
