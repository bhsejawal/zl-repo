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
      const { habitatId } = payload;
      return {
        ...state,
        activeHabitat: state.habitats
          .find(({ _id }) => _id === habitatId),
      };
    }

    default: {
      return state;
    }
  }
};
