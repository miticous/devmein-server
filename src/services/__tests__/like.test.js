import { like } from '../like';

jest.setTimeout(25000);
require('../../database');

test('Should like someone', async () => {
  const user = {
    _id: '5e6861411c9d4400001195f6'
  };
  const userLikedId = '5e684c78053c531368f25789';

  const match = await like({ user, userLikedId });

  console.log(match);
});
