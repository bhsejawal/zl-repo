import {
  ADD_MESSAGE,
  CLEAR_MESSAGES,
} from '../types';

const initialState = {
  messages: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_MESSAGE: {
      const { message } = payload;

      return {
        ...state,
        messages: [...state.messages, message],
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
