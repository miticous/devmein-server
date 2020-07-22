import axios from 'axios';

const api = axios.create({
  baseURL: process.env.ASTROLOGY_API_URL
});

export const getAstral = async ({ name, latitude, longitude, birthdate, birthplaceFuso }) => {
  try {
    const { data } = await api.post('/indices', {
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

export const getTexts = async ({ chartId }) => {
  try {
    const { data } = await api.get(`/textos/${chartId}`);

    return {
      chartId: data?._id,
      texts: data?.['const text']
    };
  } catch (error) {
    throw new Error(error);
  }
};
