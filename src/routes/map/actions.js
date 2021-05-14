import {
  SELECT_HABITAT,
  UPDATE_HABITAT_DATA,
  TOGGLE_MAP_MODAL,
  SET_EDIT_HABITAT,
} from './types';

export const selectHabitat = (habitatId) => ({
  type: SELECT_HABITAT,
  payload: { habitatId },
});

export const setEditHabitat = (habitat) => ({
  type: SET_EDIT_HABITAT,
  payload: { habitat },
});

export const updateHabitatData = (field, value) => ({
  type: UPDATE_HABITAT_DATA,
  payload: { field, value },
});

export const toggleMapModal = () => ({ type: TOGGLE_MAP_MODAL });
