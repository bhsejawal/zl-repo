import { loadPage } from '../../helpers';

export const goToSignup = () => {
  loadPage('/signup', true);
};

export const goToLogin = () => {
  loadPage('/login', true);
}

export const goToPrices = () => {
  loadPage('/prices', true);
}

export const goToGift = () => {
  loadPage('/gift', true);
}
