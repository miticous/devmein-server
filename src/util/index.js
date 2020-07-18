import moment from 'moment';
import { CURRENT_SERVER_UTC } from '../constants';

/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
export const prepare = o => {
  o._id = o._id.toString();
  return o;
};

export const getServerDate = () =>
  moment(Date.now())
    .subtract(CURRENT_SERVER_UTC, 'hours')
    .toString();

export const formatUtcOffset = offset => {
  const time = moment(offset, 'HH').format('HH:mm');

  if (offset < 0) {
    return `-${time}`;
  }
  return time;
};

export const datetimeToBrasiliaUtc = datetime =>
  moment(datetime, 'DD/MM/YYYY HH:mm')
    .subtract(3, 'hours')
    .format();
