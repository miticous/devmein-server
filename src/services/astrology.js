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
  const { data } = await api.post('/indices/instinto', {
    name,
    latitude,
    longitude,
    birthdate,
    birthplace_fuso: birthplaceFuso,
    horaverao: 'false',
    placename: ''
  });
  console.log(data);
  return data;
};

export { getAstralMapIndexes, api };
