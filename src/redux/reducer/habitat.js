import { TOGGLE_HABITAT } from '../types';

const initialState = {
  hasHabitat: false,
};

export default (state = initialState, { type }) => {
  switch (type) {
    case TOGGLE_HABITAT: {
      return {
        ...state,
        hasHabitat: !state.hasHabitat,
      };
    }
    default: {
      return state;
    }
  }
};
