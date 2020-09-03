import {
  updateProfile,
  getProfiles,
  updateProfileLocation,
  addProfileImage,
  removeProfileImage
} from '../services/profile';
import Profile from '../models/Profile';
import { sendMessage, getChat } from '../services/chat';
import { like } from '../services/like';
import { unlike } from '../services/unlike';
import { saveUserConfig } from '../services/user';
import { getMatchesByUserId } from '../services/match';

const NEW_MESSAGE = 'NEW_MESSAGE';

const resolvers = {
  Subscription: {
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator([NEW_MESSAGE])
    }
  },
  Query: {
    user: async (_, __, { user }) => {
      const { configs, profileStatus, plan } = user;
      return { configs, profileStatus, plan };
    },
    profile: async (_, __, { user: { _id } }) => {
      const profile = await Profile.findById(_id).populate({ path: 'astral', model: 'Astral' });

      if (!profile) {
        return {};
      }

      return profile;
    },
    profiles: async (_, { searchType }, { user }) => {
      const profiles = await getProfiles({ user, searchType });
      return profiles;
    },
    chat: async (_, { matchId }, { user }) => {
      const chat = await getChat({ chatId: matchId, user });

      return chat;
    },
    matches: async (_, __, { user: { _id } }) => {
      const matches = await getMatchesByUserId({ userId: _id });

      return matches;
    }
  },
  Mutation: {
    editProfile: async (_, args, { user }) => {
      const profile = await updateProfile({ user, ...args });
      return profile;
    },
    sendMessage: async (_, { matchId, message }, { user, pubsub }) => {
      const chat = await sendMessage({ matchId, sender: user, message });
      await pubsub.publish(NEW_MESSAGE, {
        newMessage: chat
      });

      return chat;
    },
    likeSomeone: async (_, { userLikedId, type }, { user }) => {
      const match = await like({ userLikedId, user, type });
      return match;
    },
    unlikeSomeone: async (_, { userUnlikedId, type }, { user }) => {
      await unlike({ user, userUnlikedId, type });
    },
    sendGeoLocation: async (_, args, { user: { _id } }) => {
      await updateProfileLocation({ ...args, userId: _id });
    },
    saveUserConfigs: async (_, data, { user }) => {
      await saveUserConfig({
        ...data,
        user
      });
    },
    addProfileImage: async (_, { file }, { user }) => {
      await addProfileImage({ file, user });
    },
    removeProfileImage: async (_, { imageId }, { user }) => {
      await removeProfileImage({ imageId, user });
    }
  }
};

export default resolvers;
