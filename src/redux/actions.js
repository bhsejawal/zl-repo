import {
  SET_USER_DATA,
  ADD_USER_INTERACTION,
  REMOVE_USER_INTERACTION,
  TOGGLE_IS_STREAM_PLAYING,
  TOGGLE_SHOW_EMOJI_BASKET,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
} from './types';

const DEFAULT_INTERACTION_TIMEOUT = 3000;

export const setUserData = ({ username, roles }) => ({
  type: SET_USER_DATA,
  payload: { username, roles },
});

let interactionId = 0;
const newUserInteraction = (payload) => ({
  type: ADD_USER_INTERACTION,
  payload: { ...payload, interactionId },
});

const removeUserInteraction = () => ({ type: REMOVE_USER_INTERACTION });

export const addUserInteraction = (payload) => (dispatch) => {
  interactionId += 1;
  dispatch(newUserInteraction(payload));
  setTimeout(() => dispatch(removeUserInteraction()), payload.ttl || DEFAULT_INTERACTION_TIMEOUT);
}

export const toggleIsStreamPlaying = () => ({ type: TOGGLE_IS_STREAM_PLAYING });
export const toggleShowEmojiBasket = () => ({ type: TOGGLE_SHOW_EMOJI_BASKET });

let messageId = 0;

const addChatMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const addMessage = (message) => (dispatch) => {
  messageId += 1;
  dispatch(addChatMessage({ message, messageId}));
}

export const clearMessages = () => ({
  type: CLEAR_MESSAGES,
});
