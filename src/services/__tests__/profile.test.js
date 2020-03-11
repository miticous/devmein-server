import { getProfilesToHome } from '../profile';

jest.setTimeout(25000);
require('../../database');

test('Should get profiles to home with existing userId', async () => {
  const user = {
    _id: '5e684c78053c531368f25789',
    loc: {
      coordinates: ['-122.406417', '37.785834']
    }
  };

  const profiles = await getProfilesToHome({ userId: user._id, maxDistance: 50 });

  console.log(profiles);
});
