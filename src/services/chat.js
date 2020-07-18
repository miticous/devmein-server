import Chat from '../models/Chat';
import Match from '../models/Match';
import { getServerDate } from '../util';
import Profile from '../models/Profile';

export const sendMessage = async ({ matchId, sender, message }) => {
  const match = await Match.findOne({ _id: matchId });

  const { _id: receiverId } = match.matches.find(
    _match => _match._id.toString() !== sender._id.toString()
  );
  const serverDate = getServerDate();

  if (!match) {
    throw new Error('This match does not exists');
  }

  const newMessage = {
    receiverId,
    senderId: sender._id,
    sentAt: serverDate,
    text: message
  };

  const chat = await Chat.findOneAndUpdate(
    { _id: match._id },
    { $addToSet: { participants: match.matches, messages: newMessage } },
    { new: true, upsert: true }
  );

  await match.update({
    lastMessage: newMessage,
    unreadMessages: match.unreadMessages + 1
  });

  return chat;
};

export const getChat = async ({ chatId, user }) => {
  try {
    const chat = await Chat.findOne({ $and: [{ _id: chatId }, { 'participants._id': user._id }] });

    const participant = chat.participants.find(
      _participant => _participant._id.toString() !== user._id.toString()
    );

    const participantProfile = await Profile.findById(participant);

    const _chat = {
      ...chat.toObject(),
      participant: participantProfile
    };

    return _chat;
  } catch (error) {
    throw new Error(error);
  }
};
