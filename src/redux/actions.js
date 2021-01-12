import { SET_USER_DATA, TOGGLE_HABITAT } from './types';

export const toggleHabitat = () => ({
  type: TOGGLE_HABITAT,
});

export const setUserData = ({ username, roles }) => ({
  type: SET_USER_DATA,
  payload: { username, roles },
});
