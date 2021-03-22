import { route } from 'preact-router';

// eslint-disable-next-line import/prefer-default-export
export const authRedirect = (path) => {
  try {
    if (path) {
      route(path, true);
    } else if (localStorage.getItem('returningUser')) {
      route('/login', true);
    } else {
      route('/', true);
    }
  } catch (err) {
    console.warn('Local storage is not available.');
    route('/', true);
  }
};
