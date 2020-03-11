import { unlike } from '../unlike';

jest.setTimeout(15000);

test('should unlike someone whitout duplicate like', async () => {
  const user = {
    _id: '5e684c78053c531368f25789'
  };
  const userUnlikedId = '5e66752e7908a379ff3f1445';

  const unliked = await unlike({ user, userUnlikedId });

  console.log(unliked);
});
