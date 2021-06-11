import { takeRight } from 'lodash-es';
import {
  ADD_MESSAGES,
  CLEAR_MESSAGES,
  MARK_MESSAGE_AS_DELETED,
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
    case MARK_MESSAGE_AS_DELETED: {
      const { messageId } = payload;
      return {
        ...state,
        messages: state.messages.map((message) => (
          message.timetoken === messageId ? { ...message, isDeleted: true } : message
        )),
      }
    }
    default: {
      return state;
    }
  }
};
