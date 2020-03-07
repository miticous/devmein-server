import { names1, names2 } from '../__mocks__/names';

function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const generateName = () => {
  const name = `${capFirst(names1[getRandomInt(0, names1.length + 1)])} ${capFirst(
    names2[getRandomInt(0, names2.length + 1)]
  )}`;
  return name;
};

export default generateName;
