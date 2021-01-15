import {
  colors,
  animals,
} from './constants';

const animalsArr = Object.values(animals);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomCursorColor = () => colors[randomInt(0, colors.length - 1)];
export const getRandomCursorAnimal = () => animalsArr[randomInt(1, animalsArr.length - 1)];
export const getAnimalCursor = (animal) => animals[animal];
