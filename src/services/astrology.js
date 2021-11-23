import axios from 'axios';

const api = axios.create({
  baseURL: process.env.ASTROLOGY_API_URL,
  maxContentLength: 13290129312
});

export const getAstral = async ({ name, latitude, longitude, birthdate, birthplaceFuso }) => ({
  chart_id: '123123',
  zodiac: 'pisces',
  instinto: 'pisces',
  mandala:
    'https://casadaarte.vteximg.com.br/arquivos/ids/211964/Mandala-MA3517-3-.jpg?v=636322741987070000'
});

// console.log('Success on using astrology api INDICES');

// return data;

export const getTexts = async ({ chartId }) => {
  try {
    // const { data } = await api.get(`/textos/${chartId}`);

    console.log('Success on using astrology api');

    return {
      chartId: '123123',
      texts: [
        {
          text: 'Testando esse texto',
          title: 'Instinto',
          subtitle: 'Testaaaaa'
        }
      ]
    };
  } catch (error) {
    console.log(`Error on using astrology api ${error?.message}`);
    throw new Error(error);
  }
};
