import { PubSub } from 'apollo-server-express';
import {
  updateProfile,
  getProfiles,
  updateProfileLocation,
  addProfileImage,
  removeProfileImage
} from '../services/profile';
import Profile from '../models/Profile';
import { sendMessage } from '../services/chat';
import Chat from '../models/Chat';
import { like } from '../services/like';
import { unlike } from '../services/unlike';
import { saveUserConfig } from '../services/user';
import { getMatchesByUserId } from '../services/match';

const pubsub = new PubSub();

const UPDATE_CHAT = 'UPDATE_CHAT';

const resolvers = {
  Subscription: {
    updateChat: {
      subscribe: () => pubsub.asyncIterator([UPDATE_CHAT])
    }
  },
  Query: {
    user: async (_, __, { user }) => {
      const { configs, profileStatus } = user;
      return { configs, profileStatus };
    },
    profile: async (_, __, { user: { _id } }) => {
      const profile = await Profile.findById(_id);
      if (!profile) {
        return {};
      }
      return profile;
    },
    profiles: async (_, { searchType }, { user }) => {
      const profiles = await getProfiles({ user, searchType });
      return profiles;
    },
    chat: async (_, { matchId }, { user: { _id } }) => {
      const chat = await Chat.findOne({ _id: matchId, 'participants._id': _id });
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
    sendMessage: async (_, { matchId, message }, { user: { _id } }) => {
      const chat = await sendMessage({ matchId, senderId: _id, message });

      await pubsub.publish(UPDATE_CHAT, {
        updateChat: chat
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
