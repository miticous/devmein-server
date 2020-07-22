import mongoose from 'mongoose';
import { getServerDate } from '../util';

export const chatSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false,
    default: () => getServerDate()
  },
  participants: [
    {
      _id: mongoose.Schema.Types.ObjectId
    }
  ],
  messages: [
    {
      senderId: {
        type: String,
        required: true
      },
      receiverId: {
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
  ]
});

chatSchema.pre('save', function() {
  this.messages = this.messages.map((message, index) => {
    if (!this.messages[index]._id) {
      this.messages[index]._id = new mongoose.Types.ObjectId();
    }
    return this.message[index];
  });
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
