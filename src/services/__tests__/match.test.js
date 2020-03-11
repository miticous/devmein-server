import Profile from '../../models/Profile';
import { createMatch } from '../match';

require('../../database');

jest.setTimeout(15000);

describe('Testing match', () => {
  const userLikedId = '5e66752e7908a379ff3f1445';
  const userLikerId = '5e684c78053c531368f25789';

  it('Should create a new match', async () => {
    const userLikedProfile = await Profile.findOne({ _id: userLikedId });
    const userLikerProfile = await Profile.findOne({ _id: userLikerId });

    const newMatch = await createMatch({ userLikerProfile, userLikedProfile });

    console.log(newMatch);
  });
});
