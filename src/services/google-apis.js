import Axios from 'axios';

export const getCitieById = async placeId => {
  const key = 'AIzaSyAsceWUlXxulQJohZddfRPstfcNl7FcE2s';

  const {
    data: {
      result: {
        geometry: {
          location: { lat, lng }
        },
        utc_offset: UTCOffset
      }
    }
  } = await Axios({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&placeid=${placeId}&language=pt-BR&fields=geometry,utc_offset`
  });
  const UTCFromMinutesToHours = UTCOffset / 60;

  return {
    placeId,
    lat: lat.toString(),
    lng: lng.toString(),
    UTC: UTCFromMinutesToHours.toString()
  };
};
