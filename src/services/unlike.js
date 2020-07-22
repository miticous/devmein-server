import Profile from '../models/Profile';
import Unlike from '../models/Unlike';

const updateUnlike = async ({ user, userUnlikedId, type }) => {
  try {
    const { unlikes } = await Unlike.findOne({ _id: user._id, 'unlikes._id': userUnlikedId });
    const { type: _type } = unlikes.find(_unlike => _unlike._id.toString() === userUnlikedId);

    if (_type === type || _type === 'BOTH') {
      throw new Error('An error occur while unliking twice');
    }

    if (_type !== type) {
      return Unlike.findOneAndUpdate(
        { _id: user._id, 'unlikes._id': userUnlikedId },
        {
          $set: { 'unlikes.$.type': 'BOTH', 'unlikes.$._id': userUnlikedId }
        },
        {
          new: true,
          upsert: true
        }
      );
    }

    return false;
  } catch (error) {
    throw new Error(error);
  }
};

export const unlike = async ({ user, userUnlikedId, type }) => {
  const userUnlikedProfile = await Profile.findOne({ _id: userUnlikedId });

  if (!userUnlikedProfile) {
    throw new Error('User unliked does not exists');
  }
  try {
    await Unlike.findOneAndUpdate(
      { _id: user._id, 'unlikes._id': { $ne: { _id: userUnlikedId } } },
      { $addToSet: { unlikes: { _id: userUnlikedId, type } } },
      { new: true, upsert: true }
    );
    return true;
  } catch (error) {
    return updateUnlike({ user, userUnlikedId, type });
  }
};

export const getUnlikesByUserId = async ({ userId, type }) => {
  try {
    const { unlikes } = await Unlike.findOne(
      { _id: userId, 'unlikes.type': { $in: [type, 'BOTH'] } },
      { 'unlikes.$': 1, _id: 0 }
    );

    return unlikes;
  } catch (error) {
    return [];
  }
};
