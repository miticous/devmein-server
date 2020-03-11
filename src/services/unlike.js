import Profile from '../models/Profile';
import Unlike from '../models/Unlike';

export const unlike = async ({ user, userUnlikedId }) => {
  const userUnlikedProfile = await Profile.findOne({ _id: userUnlikedId });

  if (!userUnlikedProfile) {
    throw new Error('User unliked does not exists');
  }
  try {
    await Unlike.findOneAndUpdate(
      { _id: user._id, 'unlikes._id': { $ne: { _id: userUnlikedId } } },
      { $addToSet: { unlikes: { _id: userUnlikedId } } },
      { new: true, upsert: true }
    );
    return true;
  } catch (error) {
    throw new Error('This user is already unliked');
  }
};

export const getUnlikesByUserId = async ({ userId }) => {
  try {
    const { unlikes } = await Unlike.findOne({ _id: userId }, { unlikes: 1, _id: 0 });

    return unlikes;
  } catch (error) {
    return [];
  }
};
