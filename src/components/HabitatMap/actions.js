import { SET_MAP_DATA } from './types';
import { getMapData } from './api';

const setMapData = ({ data }) => ({
  type: SET_MAP_DATA,
  payload: data,
});

// eslint-disable-next-line import/prefer-default-export
export const fetchMapData = () => async (dispatch) => {
  try {
    const data = await getMapData();
    dispatch(setMapData({data}));
  } catch (error) {
    console.error(error);
  }
};
