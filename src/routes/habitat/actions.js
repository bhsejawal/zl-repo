import { LOAD_HABITAT_SETTINGS } from './types';
import { getHabitatSettings } from './api';

const requestHabitatSettings = () => ({ type: LOAD_HABITAT_SETTINGS });

const receiveHabitatSettings = (error, habitat) => ({
  type: LOAD_HABITAT_SETTINGS,
  payload: { error, habitat },
});

// eslint-disable-next-line import/prefer-default-export
export const fetchHabitatSettings = (habitatId) => async (dispatch) => {
  dispatch(requestHabitatSettings());

  try {
    const habitat = await getHabitatSettings(habitatId);
    dispatch(receiveHabitatSettings(undefined, habitat));
  } catch (err) {
    console.error(err);
    dispatch(receiveHabitatSettings(err.message));
  }
};
