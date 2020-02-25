import Chat from '../models/Chat';
import Match from '../models/Match';

export const sendMessage = async ({ matchId, senderId, message }) => {
  const match = await Match.findOne({ _id: matchId });

  if (!match) {
    throw new Error('This match does not exists');
  }

  const newMessage = {
    receiver_id: match.matches.find(profile => profile._id.toString() !== senderId.toString())._id,
    sender_id: senderId,
    text: message
  };

  const chat = await Chat.findOneAndUpdate(
    { _id: match._id },
    { $addToSet: { participants: match.matches, messages: newMessage } },
    { new: true, upsert: true }
  );

  await match.update({
    lastMessage: chat.messages.sort((prevMessage, nextMessage) =>
      prevMessage.sentAt > nextMessage.sentAt ? -1 : 1
    )[0]
  });

  return chat;
};
