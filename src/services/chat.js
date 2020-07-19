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

  await Chat.findOneAndUpdate(
    { _id: match._id },
    {
      $addToSet: { participants: match.matches, messages: newMessage }
    },
    { new: true, upsert: true }
  );

  const chat = await Chat.findOneAndUpdate(
    {
      $and: [{ _id: matchId }, { 'participants._id': { $eq: sender?._id } }]
    },
    {
      $set: { 'messages.$[el].viewed': true }
    },
    {
      arrayFilters: [{ 'el.senderId': receiverId?._id }],
      new: true
    }
  );

  const unreadMessagesCount = chat?.messages?.filter(_message => _message?.viewed === false);

  await match.update({
    lastMessage: newMessage,
    unreadMessages: unreadMessagesCount?.length
  });

  return chat;
};

export const getChat = async ({ chatId, user }) => {
  try {
    const chat = await Chat.findOne({ $and: [{ _id: chatId }, { 'participants._id': user._id }] });

    const participant = chat?.participants?.find(
      _participant => _participant._id.toString() !== user._id.toString()
    );

    const _chat = await Chat.findOneAndUpdate(
      {
        $and: [{ _id: chatId }, { 'participants._id': { $eq: user?._id } }]
      },
      {
        $set: { 'messages.$[el].viewed': true }
      },
      {
        arrayFilters: [{ 'el.senderId': participant?._id }],
        new: true
      }
    );

    const lastMessageSenderId = _chat?.messages?.[_chat?.messages?.length - 1].senderId;

    if (lastMessageSenderId.toString() === participant?._id?.toString()) {
      await Match.findOneAndUpdate(
        { $and: [{ _id: chatId }, { 'matches._id': user._id }] },
        {
          $set: { unreadMessages: 0 }
        },
        {
          new: true
        }
      );
    }

    const participantProfile = await Profile.findById(participant);

    const __chat = {
      ..._chat?.toObject(),
      participant: participantProfile
    };

    return __chat;
  } catch (error) {
    throw new Error(error);
  }
};
