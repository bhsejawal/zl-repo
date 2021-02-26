import { SET_MAP_DATA, SELECT_HABITAT } from './types';

export const setMapData = (habitats) => ({
  type: SET_MAP_DATA,
  payload: { habitats },
});

export const setHabitat = (habitatId) => ({
  type: SELECT_HABITAT,
  payload: { habitatId },
});
