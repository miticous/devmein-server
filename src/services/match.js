import Match from '../models/Match';

export const createMatch = async ({ userLikedProfile, userLikerProfile }) => {
  const isMatchAlreadyCreated = await Match.findOne({
    $and: [{ 'matches._id': userLikerProfile._id }, { 'matches._id': userLikedProfile._id }]
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

export const getMatchesByUserId = async ({ _id }) => {
  try {
    const matches = await Match.find({ 'matches._id': _id });
    return matches;
  } catch (error) {
    return [];
  }
};
