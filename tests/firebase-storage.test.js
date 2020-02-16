import path from 'path';
import bucket from '../src/storage/index';

describe('Working with firebase', () => {
  it('should create firebase storage ref', async () => {
    const file = await bucket.upload(path.join(__dirname, '../', 'teste.txt'));

    expect(file).toHaveLength(2);
  });
});
