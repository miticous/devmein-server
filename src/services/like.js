import Like from '../models/Like';
import Profile from '../models/Profile';
import Match from '../models/Match';

export const like = async ({ userLikedId, user }) => {
  if (userLikedId === user._id) {
    throw new Error('Cannot like himself');
  }

  const userLikedProfile = await Profile.findById(userLikedId);
  const userLikerProfile = await Profile.findById(user._id);

  if (!userLikedProfile) {
    throw new Error('User liked not exists');
  }

  await Like.findOneAndUpdate(
    { _id: userLikedId },
    { $addToSet: { likers: userLikerProfile } },
    { new: true, upsert: true }
  );

  const isUserLikerLiked = await Like.findOne({ _id: user._id, 'likers._id': userLikedId });

  if (!isUserLikerLiked) {
    return false;
  }

  const isMatchAlreadyCreated = await Match.findOne({
    $and: [{ 'matches._id': user._id }, { 'matches._id': userLikedId }]
  });

  if (isMatchAlreadyCreated) {
    throw new Error('Users already been matched');
  }

  const match = new Match({
    matches: [userLikedProfile, userLikerProfile]
  });
  const newMatch = await match.save();

  return newMatch;
};
