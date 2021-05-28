import { takeRight } from 'lodash-es';
import {
  ADD_MESSAGES,
  CLEAR_MESSAGES,
} from '../types';

const initialState = {
  messages: [],
};

const MAX_MESSAGES = 50;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_MESSAGES: {
      const { messages } = payload;
      return {
        ...state,
        messages: takeRight([...state.messages, ...messages], MAX_MESSAGES),
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
