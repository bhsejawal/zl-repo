import { SET_MAP_DATA } from './types';

const initialState = {
  habitats: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MAP_DATA: {
      const { habitats } = payload;
      return { ...state, habitats };
    }

    default: {
      return state;
    }
  }
};
