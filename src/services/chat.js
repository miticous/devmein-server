import { ApolloError } from 'apollo-server-express';
import Chat from '../models/Chat';
import { getServerDate } from '../util';
import Profile from '../models/Profile';

export const sendMessage = async args => {
  const { userId, targetUserId, message } = args;
  try {
    const chat = await Chat.findOne({
      $and: [{ 'participants._id': userId }, { 'participants._id': targetUserId }]
    });

    const newMessage = {
      text: message,
      sender_id: userId,
      receiver_id: targetUserId,
      sentAt: getServerDate()
    };

    if (chat) {
      const newChat = await Chat.findByIdAndUpdate(
        chat._id,
        {
          messages: [...chat.messages, { ...newMessage }]
        },
        { new: true }
      );
      return newChat;
    }

    const participants = await Profile.find({
      _id: {
        $in: [userId, targetUserId]
      }
    });

    const newChat = new Chat({
      participants,
      messages: [{ ...newMessage }]
    });

    return newChat.save();
  } catch (error) {
    throw new ApolloError(error);
  }
};
