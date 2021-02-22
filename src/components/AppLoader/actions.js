import { route } from 'preact-router';
import { HIDE_APP_LOADER, SHOW_APP_LOADER } from './types';
import { getUser as get } from './api';
import { setUserData } from '../../redux/actions';

const showLoader = () => ({ type: SHOW_APP_LOADER });
const hideLoader = () => ({ type: HIDE_APP_LOADER });

// eslint-disable-next-line import/prefer-default-export
export const getUser = () => async (dispatch) => {
  try {
    dispatch(showLoader());
    const data = await get();
    dispatch(setUserData(data));
  } catch (error) {
    if (error.statusCode === 401) {
      console.error('User is not authenticated', error);
      if (!['/login', '/signup'].includes(window.location.pathname)) {
        route('/login', true);
      }
    } else {
      console.error('Error while getting user info', error);
    }
  } finally {
    dispatch(hideLoader());
  }
};
