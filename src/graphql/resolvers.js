import { PubSub } from 'apollo-server-express';
import { createProfile } from '../services/profile';
import User from '../models/User';
import Profile from '../models/Profile';
import { sendMessage } from '../services/chat';
import Chat from '../models/Chat';
import { like } from '../services/like';

const pubsub = new PubSub();

const UPDATE_CHAT = 'UPDATE_CHAT';

const resolvers = {
  Subscription: {
    updateChat: {
      subscribe: () => pubsub.asyncIterator([UPDATE_CHAT])
    }
  },
  Query: {
    user: async (root, args, context) => {
      const { name, email } = await User.findById(context.userId);
      return { name, email };
    },
    profile: async (root, args, { user: { _id } }) => {
      const profile = await Profile.findById(_id);
      if (!profile) {
        return {};
      }
      return profile;
    },
    chat: async (root, args, { user: { _id } }) => {
      const chat = await Chat.findOne({
        $and: [{ 'participants._id': _id }, { 'participants._id': args.targetUserId }]
      });
      return chat;
    }
  },
  Mutation: {
    createProfile: async (root, args, context) => {
      const profile = await createProfile({ authorization: context.authorization, ...args });
      return profile;
    },
    sendMessage: async (root, { matchId, message }, { user: { _id } }) => {
      const chat = await sendMessage({ matchId, senderId: _id, message });

      await pubsub.publish(UPDATE_CHAT, {
        updateChat: chat
      });

      return chat;
    },
    likeSomeone: async (root, { userLikedId }, { user }) => {
      const match = await like({ userLikedId, user });
      return match;
    }
  }
};

export default resolvers;
