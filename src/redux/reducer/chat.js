import { takeRight, omit, concat } from 'lodash-es';
import {
  ADD_MESSAGES,
  CLEAR_MESSAGES,
  MARK_MESSAGE_AS_DELETED,
  TOGGLE_MESSAGE_REACTION,
  SET_REPLY_MESSAGE,
} from '../types';

const initialState = {
  channels: {},
  replyMessage: {
    timetoken: null,
    username: null,
    animal: null,
    color: null,
    text: null,
    channel: null,
  },
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
      const { channelId, messages } = payload;

      return {
        ...state,
        channels: {
          ...state.channels,
          [channelId]: {
            messages: takeRight(concat(
              ...state.channels[channelId]?.messages ?? [],
              ...messages,
            ), MAX_MESSAGES),
          },
        },
      };
    }
    case CLEAR_MESSAGES: {
      const { channelId } = payload;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelId]: undefined,
        },
      };
    }
    case MARK_MESSAGE_AS_DELETED: {
      const { channelId, messageId } = payload;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelId]: {
            messages: state.channels[channelId]?.messages?.map((message) => (
              message.timetoken === messageId ? { ...message, isDeleted: true } : message
            )),
          },
        },
      }
    }
    case TOGGLE_MESSAGE_REACTION: {
      const {
        channelId,
        messageId,
        reaction: type,
        reactionId,
        userId,
      } = payload;

      return {
        ...state,
        channels: {
          ...state.channels,
          [channelId]: {
            messages: state.channels[channelId]?.messages?.map((message) => (
              message.timetoken === messageId ? {
                ...message,
                reactions: handleReactionChange(
                  message.reactions,
                  type,
                  { uuid: userId, actionTimetoken: reactionId },
                ),
              } : message
            )),
          },
        },
      }
    }
    case SET_REPLY_MESSAGE: {
      const {
        timetoken,
        username,
        text,
        animal,
        color,
        channel,
      } = payload;

      return {
        ...state,
        replyMessage: {
          timetoken,
          username,
          text,
          animal,
          color,
          channel,
        },
      }
    }
    default: {
      return state;
    }
  }
};
