import { SET_USER_PROFILE } from '../../redux/types';

// eslint-disable-next-line import/prefer-default-export
export const updateProfile = (color, animalIcon, nickname) => ({
  type: SET_USER_PROFILE,
  payload: { profile: { color, animalIcon, nickname } },
});
