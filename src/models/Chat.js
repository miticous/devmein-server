import mongoose from 'mongoose';
import { getServerDate } from '../util';
import { profileSchema } from './Profile';

const chatSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false
  },
  participants: [profileSchema],
  messages: [
    {
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
        required: true
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
  ]
});

chatSchema.pre('save', function() {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.startedAt) {
    this.startedAt = getServerDate();
  }
  this.messages = this.messages.map((message, index) => {
    if (!this.messages[index]._id) {
      this.messages[index]._id = new mongoose.Types.ObjectId();
    }
    return this.message[index];
  });
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
