/* eslint-disable no-await-in-loop */
import Match from '../models/Match';
import Profile from '../models/Profile';

export const verifyMatch = ({ userLikerLikeType, userLikedLikeType }) => {
  if (userLikedLikeType === userLikerLikeType) {
    return userLikedLikeType;
  }
  if (userLikedLikeType === 'BOTH' || userLikerLikeType === 'BOTH') {
    const matchType = [userLikerLikeType, userLikedLikeType].find(type => type !== 'BOTH');

    return matchType;
  }

  return null;
};

export const createMatch = async ({ userLikedId, userLikerId, type, userLikedProfile }) => {
  const match = await Match.findOne({
    $and: [{ 'matches._id': userLikedId }, { 'matches._id': userLikerId }]
  });

  if (match) {
    const _match = await Match.findOneAndUpdate(
      { _id: match._id },
      {
        type
      },
      {
        new: true
      }
    );

    return _match;
  }

  const _match = new Match({
    matches: [{ _id: userLikerId }, { _id: userLikedId }],
    type
  });

  await _match.save();

  return userLikedProfile;
};

export const getMatchesByUserId = async ({ userId }) => {
  try {
    const userMatches = await Match.find({ 'matches._id': userId });

    const _userMatches = [];

    for (let i = 0; i < userMatches.length; i += 1) {
      const matchedId = userMatches[i].matches.find(
        _match => _match._id.toString() !== userId.toString()
      );
      const profiledMatched = await Profile.findOne({ _id: matchedId });

      _userMatches.push({
        ...userMatches[i].toObject(),
        profileMatched: profiledMatched.toObject()
      });
    }

    return _userMatches;
  } catch (error) {
    throw new Error(error);
  }
};
