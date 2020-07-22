import { registerUser } from '../user';

require('../../database');

jest.setTimeout(10000);

test('', async () => {
  const user = await registerUser({ password: '123123', email: 'day@gmail.com' });

  console.log(user);
});
