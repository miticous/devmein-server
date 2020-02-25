import { PubSub } from 'apollo-server-express';
import { createProfile } from '../services/profile';
import User from '../models/User';
import Profile from '../models/Profile';
import { sendMessage } from '../services/chat';
import Chat from '../models/Chat';

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
    profile: async (root, args, { userId }) => {
      const profile = await Profile.findById(userId);
      if (!profile) {
        return {};
      }
      return profile;
    },
    chat: async (root, args, { userId }) => {
      const chat = await Chat.findOne({
        $and: [{ 'participants._id': userId }, { 'participants._id': args.targetUserId }]
      });
      return chat;
    }
  },
  Mutation: {
    createProfile: async (root, args, context) => {
      const profile = await createProfile({ authorization: context.authorization, ...args });
      return profile;
    },
    sendMessage: async (root, args, { userId }) => {
      const chat = await sendMessage({ ...args, userId });

      await pubsub.publish(UPDATE_CHAT, {
        updateChat: chat
      });

      return chat;
    }
  }
};

export default resolvers;
