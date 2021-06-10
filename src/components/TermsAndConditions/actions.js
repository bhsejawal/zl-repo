import { CLOSE_TERMS_MODAL, OPEN_TERMS_MODAL, SET_TERMS_ACCEPTED } from './types';

export const openTermsModal = (isCloseDisabled, file = 'terms') => ({
  type: OPEN_TERMS_MODAL,
  payload: { isCloseDisabled, file },
});

export const closeTermsModal = () => ({ type: CLOSE_TERMS_MODAL });
export const setUserTermsAccepted = () => ({ type: SET_TERMS_ACCEPTED });
