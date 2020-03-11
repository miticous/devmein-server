import Like from '../models/Like';
import Profile from '../models/Profile';
import { createMatch } from './match';

export const like = async ({ userLikedId, user }) => {
  if (userLikedId === user._id) {
    throw new Error('Cannot like himself');
  }

  const userLikedProfile = await Profile.findById(userLikedId);
  const userLikerProfile = await Profile.findById(user._id);

  if (!userLikedProfile) {
    throw new Error('User liked not exists');
  }

  try {
    await Like.findOneAndUpdate(
      { _id: user._id, 'likes._id': { $ne: { _id: userLikedId } } },
      { $addToSet: { likes: { _id: userLikedId } } },
      { new: true, upsert: true }
    );
  } catch (error) {
    throw new Error('User already liked');
  }

  const isUserLikerLiked = await Like.findOne({
    _id: userLikedProfile._id,
    'likes._id': userLikerProfile._id
  });

  if (!isUserLikerLiked) {
    return false;
  }

  const match = await createMatch({ userLikedProfile, userLikerProfile });

  return match;
};

export const getLikesByUserId = async ({ userId }) => {
  try {
    const { likes } = await Like.findOne({ _id: userId }, { likes: 1, _id: 0 });

    return likes;
  } catch (error) {
    return [];
  }
};
