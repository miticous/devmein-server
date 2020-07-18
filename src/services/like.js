import Like from '../models/Like';
import Profile from '../models/Profile';
import { createMatch, verifyMatch } from './match';

const getLikeTypes = ({ userLikerLike, userLikedLike }) => {
  const { type: userLikerLikeType } = userLikerLike.likes.find(
    like => like._id.toString() === userLikedLike._id.toString()
  );

  const { type: userLikedLikeType } = userLikedLike.likes.find(
    like => like._id.toString() === userLikerLike._id.toString()
  );

  return {
    userLikerLikeType,
    userLikedLikeType
  };
};

const updateLike = async ({ user, userLikedId, type }) => {
  try {
    const { likes } = await Like.findOne({ _id: user._id, 'likes._id': userLikedId });
    const { type: _type } = likes.find(_like => _like._id.toString() === userLikedId);

    if (_type === type || _type === 'BOTH') {
      throw new Error('An error occur while liking twice');
    }

    if (_type !== type) {
      const userLikerLike = await Like.findOneAndUpdate(
        { _id: user._id, 'likes._id': userLikedId },
        {
          $set: { 'likes.$.type': 'BOTH', 'likes.$._id': userLikedId }
        },
        {
          new: true,
          upsert: true
        }
      );

      return userLikerLike;
    }

    return false;
  } catch (error) {
    throw new Error(error);
  }
};

export const like = async ({ userLikedId, user, type }) => {
  if (userLikedId === user._id) {
    throw new Error('Cannot like himself');
  }

  const userLikedProfile = await Profile.findById(userLikedId);
  const userLikerProfile = await Profile.findById(user._id);
  const userLikedLike = await Like.findOne({ _id: userLikedId });

  if (!userLikedProfile || !userLikerProfile) {
    throw new Error('An error occur while trying to get both profiles');
  }

  try {
    const userLikerLike = await Like.findOneAndUpdate(
      { _id: user._id, 'likes._id': { $ne: { _id: userLikedId } } },
      { $addToSet: { likes: { _id: userLikedId, type } } },
      { new: true, upsert: true }
    );

    const matchType = verifyMatch({ ...getLikeTypes({ userLikerLike, userLikedLike }) });

    if (matchType) {
      return createMatch({ userLikedId, userLikerId: user._id, type: matchType, userLikedProfile });
    }

    return false;
  } catch (error) {
    const userLikerLike = await updateLike({ user, userLikedId, type });

    const matchType = verifyMatch({ ...getLikeTypes({ userLikerLike, userLikedLike }) });

    if (matchType) {
      return createMatch({ userLikedId, userLikerId: user._id, type: matchType, userLikedProfile });
    }

    return false;
  }
};

export const getLikesByUserId = async ({ userId, type }) => {
  try {
    const { likes } = await Like.findOne(
      { _id: userId, 'likes.type': { $in: [type, 'BOTH'] } },
      { 'likes.$': 1, _id: 0 }
    );

    return likes;
  } catch (error) {
    return [];
  }
};
