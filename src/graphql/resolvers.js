import { createProfile } from '../services/profile';
import User from '../models/User';
import Profile from '../models/Profile';
import { sendMessage } from '../services/chat';

const resolvers = {
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
    }
  },
  Mutation: {
    createProfile: async (root, args, context) => {
      const profile = await createProfile({ authorization: context.authorization, ...args });
      return profile;
    },
    sendMessage: async (root, args, { userId }) => {
      const chat = await sendMessage({ ...args, userId });
      return chat;
    }
  }
};

export default resolvers;
