import {route} from 'preact-router';
import {
  ENABLE_PASSWORD_RESET_BUTTON,
  SHOW_PASSWORD_RESET_MODAL,
  INVALID_TOKEN,
  TOKEN,
} from './types';
import { validateToken as validateTokenApi } from './api';

export const showModal = (showModal) => ({
  type: SHOW_PASSWORD_RESET_MODAL,
  payload: { showModal },
});

export const enableSubmit = (submitEnabled) => ({
  type: ENABLE_PASSWORD_RESET_BUTTON,
  payload: { submitEnabled },
});

export const setToken = (token) => ({
  type: TOKEN,
  payload: { token },
});

export const setInvalidToken = (invalidToken) => ({
  type: INVALID_TOKEN,
  payload: { invalidToken },
});

export const validateToken = (token) => async (dispatch) => {
  try {
    dispatch(setToken(token));
    const { isValid } = await validateTokenApi(token);
    if (!isValid) {
      dispatch(showModal(true));
      route('/login', true);
    } else {
      route('/passwordReset');
    }
    dispatch(setInvalidToken(!isValid));
  } catch (err) {
    console.error('Error while validating token', err);
    dispatch(setInvalidToken(false));
  }
};
