import { loadPage } from '../../helpers';

export const goToSignup = () => {
  loadPage('/signup', true);
};

export const goToLogin = () => {
  loadPage('/login', true);
}
