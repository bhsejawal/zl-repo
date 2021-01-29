import { sampleSize, random } from 'lodash-es';

const animals = ['bat', 'duck'];

const getRandomAnimal = () => animals[random(0, animals.length - 1)];

const colors = ['#8257FF', '#7033FF', '#0B50FF', '#356DFF', '#0085FF'];

const getRandomColor = () => colors[random(0, colors.length - 1)];

const generateUUID = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return sampleSize(chars, length).join('');
};

const generateRandomName = () => `zl-dev-${random(100, 999)}`;

// eslint-disable-next-line import/prefer-default-export
export const generateUserData = () => ({
  animal: getRandomAnimal(),
  color: getRandomColor(),
  username: generateRandomName(),
  userId: generateUUID(),
});

export const isValidUrl = (url) => {
  try {
    return !!(new URL(url.startsWith('/')
      ? `${window.location.origin}${url}`
      : url));
  } catch {
    return false;
  }
};
