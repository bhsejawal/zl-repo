import { SET_HABITAT, SET_HABITAT_LIKED, UNSET_HABITAT } from './types';

export const setHabitat = ({ habitat }) => ({
  type: SET_HABITAT,
  payload: { habitat },
});

export const setHabitatLiked = (isLiked) => ({
  type: SET_HABITAT_LIKED,
  payload: { isLiked },
});

export const unsetHabitat = () => ({ type: UNSET_HABITAT });
