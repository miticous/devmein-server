import { getUnlikesByUserId } from '../unlike';

jest.setTimeout(25000);
require('../../database');

// test('should unlike someone whitout duplicate like', async () => {
//   const user = {
//     _id: '5e684c78053c531368f25789'
//   };
//   const userUnlikedId = '5e66752e7908a379ff3f1445';
//   try {
//     const unliked = await unlike({ user, userUnlikedId });
//     console.log(unliked);
//   } catch (error) {}
// });

test('should get unliked profiles by user id', async () => {
  const userId = '5e684c78053c531368f25789';

  const unlikedProfiles = await getUnlikesByUserId({ userId });

  console.log(unlikedProfiles);
});
