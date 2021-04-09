import {
  SET_MAP_DATA,
  SELECT_HABITAT,
  UPDATE_HABITAT_DATA,
  TOGGLE_MAP_MODAL,
  SELECT_EDIT_HABITAT,
  UPDATE_HABITAT_LIST,
} from './types';

export const setMapData = (habitats) => ({
  type: SET_MAP_DATA,
  payload: { habitats },
});

export const updateHabitatList = () => ({ type: UPDATE_HABITAT_LIST });

export const setHabitat = (habitatId) => ({
  type: SELECT_HABITAT,
  payload: { habitatId },
});

export const selectEditHabitat = (habitatId) => ({
  type: SELECT_EDIT_HABITAT,
  payload: { habitatId },
});

export const updateHabitatData = (field, value) => ({
  type: UPDATE_HABITAT_DATA,
  payload: { field, value },
});

export const toggleMapModal = () => ({ type: TOGGLE_MAP_MODAL });
