import axios from 'axios';

const api = axios.create({
  baseURL: process.env.ASTROLOGY_API_URL
});

const getAstralMapIndexes = async ({
  name,
  latitude,
  longitude,
  birthdate,
  birthplaceFuso
  //   horaverao
}) => {
  const { data } = await api.post('', {
    name,
    latitude,
    longitude,
    birthdate,
    birthplace_fuso: birthplaceFuso,
    horaverao: 'false',
    placename: ''
  });

  return Object.values(data)[0];
};

export { getAstralMapIndexes, api };
