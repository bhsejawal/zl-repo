import { SET_MAP_DATA, SELECT_HABITAT } from './types';
import { getMapData } from './api';

const setMapData = ({ data }) => ({
  type: SET_MAP_DATA,
  payload: data,
});

export const fetchMapData = () => async (dispatch) => {
  try {
    const data = await getMapData();
    dispatch(setMapData({data}));
  } catch (error) {
    console.error(error);
  }
};

export const setHabitat = (habitat) => ({
  type: SELECT_HABITAT,
  payload: { habitat },
});
