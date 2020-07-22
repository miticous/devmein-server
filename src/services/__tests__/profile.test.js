import { getProfilesToHome } from '../profile';

jest.setTimeout(25000);
require('../../database');

test('Should get profiles to home with existing userId', async () => {
  const user = {
    _id: '5e684c78053c531368f25789',
    configs: {
      searchGenre: 'FEMALE',
      maxDistance: 100
    }
  };

  const profiles = await getProfilesToHome({ user });

  console.log(profiles);
});
