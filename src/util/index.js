/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
export const prepare = o => {
  o._id = o._id.toString();
  return o;
};
