import { SET_MAP_DATA, SELECT_HABITAT } from './types';

const initialState = {
  habitats: [],
  activeHabitat: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MAP_DATA: {
      const { habitats } = payload;
      return { ...state, habitats };
    }

    case SELECT_HABITAT: {
      const { habitat } = payload;
      return {
        ...state,
        activeHabitat: state.activeHabitat !== habitat ? habitat : null,
      };
    }

    default: {
      return state;
    }
  }
};
