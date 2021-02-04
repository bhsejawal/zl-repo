import {
  ADD_MESSAGES,
  CLEAR_MESSAGES,
} from '../types';

const initialState = {
  messages: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_MESSAGES: {
      const { messages } = payload;

      return {
        ...state,
        messages: [...state.messages, ...messages],
      };
    }
    case CLEAR_MESSAGES: {
      return {
        ...state,
        messages: [],
      };
    }
    default: {
      return state;
    }
  }
};
