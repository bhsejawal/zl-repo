import { takeRight, omit } from 'lodash-es';
import {
  ADD_MESSAGES,
  CLEAR_MESSAGES,
  MARK_MESSAGE_AS_DELETED,
  TOGGLE_MESSAGE_REACTION,
} from '../types';

const initialState = {
  messages: [],
};

const MAX_MESSAGES = 50;

const handleReactionChange = (reactions, type, newReaction) => {
  if (!reactions[type] || !reactions[type].length) {
    return { ...reactions, [type]: [newReaction] };
  }

  const isDelete = reactions[type].some((r) => r.actionTimetoken === newReaction.actionTimetoken);

  if (isDelete && reactions[type].length === 1) {
    return omit(reactions, [type]);
  }

  if (isDelete) {
    return {
      ...reactions,
      [type]: reactions[type].filter((r) => r.actionTimetoken !== newReaction.actionTimetoken),
    }
  }

  return {
    ...reactions,
    [type]: [...reactions[type], newReaction],
  };
}

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
    case TOGGLE_MESSAGE_REACTION: {
      const {
        messageId,
        reaction: type,
        reactionId,
        userId,
      } = payload;

      return {
        ...state,
        messages: state.messages.map((message) => (
          message.timetoken === messageId ? {
            ...message,
            reactions: handleReactionChange(
              message.reactions,
              type,
              { uuid: userId, actionTimetoken: reactionId },
            ),
          } : message
        )),
      }
    }
    default: {
      return state;
    }
  }
};
