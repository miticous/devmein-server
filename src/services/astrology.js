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
  try {
    const { data } = await api.post('/indices/instinto', {
      name,
      latitude,
      longitude,
      birthdate,
      birthplace_fuso: birthplaceFuso,
      horaverao: 'false',
      placename: ''
    });

    return data;
  } catch (error) {
    return false;
  }
};

export { getAstralMapIndexes, api };
