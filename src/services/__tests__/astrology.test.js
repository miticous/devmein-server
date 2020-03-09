import { getAstralMapIndexes } from '../astrology';
import { formatUtcOffset, datetimeToBrasiliaUtc } from '../../util';

describe('tests services from astrology', () => {
  const mockPersonData = {
    name: 'Murilo',
    latitude: '-16.6782694',
    longitude: '-49.3233247',
    birthdate: new Date(datetimeToBrasiliaUtc('07/03/1994 08:45')),
    birthplace_fuso: formatUtcOffset('-3'),
    horaverao: 'false',
    placename: ''
  };

  it('should format fuso', () => {
    const number = '-3';

    expect(formatUtcOffset(number)).toEqual('-03:00');
    expect(formatUtcOffset(number * -1)).toEqual('03:00');
  });

  it('should return indexes from astrology method', async () => {
    try {
      const indexes = await getAstralMapIndexes({
        ...mockPersonData,
        birthplaceFuso: mockPersonData.birthplace_fuso
      });

      expect(indexes.length).toBeGreaterThan(1);
    } catch (error) {
      console.log(error);
    }
  });
});
