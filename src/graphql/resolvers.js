import { PubSub } from 'apollo-server-express';
import { createProfile } from '../services/profile';
import User from '../models/User';
import Profile from '../models/Profile';
import { sendMessage } from '../services/chat';
import Chat from '../models/Chat';
import { like } from '../services/like';
import Match from '../models/Match';

const pubsub = new PubSub();

const UPDATE_CHAT = 'UPDATE_CHAT';

const resolvers = {
  Subscription: {
    updateChat: {
      subscribe: () => pubsub.asyncIterator([UPDATE_CHAT])
    }
  },
  Query: {
    user: async (_, __, context) => {
      const { name, email } = await User.findById(context.userId);
      return { name, email };
    },
    profile: async (_, __, { user: { _id } }) => {
      const profile = await Profile.findById(_id);
      if (!profile) {
        return {};
      }
      return profile;
    },
    chat: async (_, { matchId }, { user: { _id } }) => {
      const chat = await Chat.findOne({ _id: matchId, 'participants._id': _id });
      return chat;
    },
    matches: async (_, __, { user: { _id } }) => {
      const matches = Match.find({ 'matches._id': _id });
      return matches;
    }
  },
  Mutation: {
    createProfile: async (_, args, context) => {
      const profile = await createProfile({ authorization: context.authorization, ...args });
      return profile;
    },
    sendMessage: async (_, { matchId, message }, { user: { _id } }) => {
      const chat = await sendMessage({ matchId, senderId: _id, message });

      await pubsub.publish(UPDATE_CHAT, {
        updateChat: chat
      });

      return chat;
    },
    likeSomeone: async (_, { userLikedId }, { user }) => {
      const match = await like({ userLikedId, user });
      return match;
    }
  }
};

export default resolvers;
