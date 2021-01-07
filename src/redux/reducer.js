import { TOGGLE_HABITAT } from './types';

const initialState = {
  hasHabitat: false,
  // This will hold current user data and should be refactor as we create sessions
  user: {
    animal: 'dog',
    color: '#7033ff',
  },
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
