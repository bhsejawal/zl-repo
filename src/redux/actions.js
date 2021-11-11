import { get } from 'lodash-es';
import { getConfig } from '../helpers';
import { setGAUserId } from '../shared/ga';

import {
  SET_USER_DATA,
  ADD_USER_INTERACTION,
  REMOVE_USER_INTERACTION,
  TOGGLE_IS_STREAM_PLAYING,
  TOGGLE_SHOW_EMOJI_BASKET,
  ADD_MESSAGES,
  CLEAR_MESSAGES,
  MARK_MESSAGE_AS_DELETED,
  TOGGLE_MESSAGE_REACTION,
  SHOW_SNAPSHOT_SHARE_POPUP,
  SET_SESSION_CHECHED,
  UNSET_USER_DATA,
  UPDATE_USER_PROPERTY,
  SET_SUBSCRIPTION_DATA,
  SET_PLANS,
  UPDATE_SUBSCRIPTION_DATA,
  UPDATE_FAVORITE_HABITATS,
  TOGGLE_IS_BROADCASTING,
  UPDATE_REFERRAL_DATA,
  SET_HABITATS,
  UPDATE_HABITAT,
  UNSET_HABITATS,
  UPDATE_CLIP_BUTTON_CLICKED,
  UPDATE_VIEWERS,
  SET_REPLY_MESSAGE,
} from './types';

export const setSubscriptionData = (payload) => ({ type: SET_SUBSCRIPTION_DATA, payload });

export const setUserDataAction = (payload) => ({ type: SET_USER_DATA, payload });

export const updateUserProperty = (property) => ({
  type: UPDATE_USER_PROPERTY,
  payload: { property },
});

export const setUserData = ({ _id: userId, ...rest }) => (dispatch) => {
  setGAUserId(userId);
  dispatch(setUserDataAction({ userId, ...rest }));
}

export const updateFavoriteHabitat = (habitatId) => ({
  type: UPDATE_FAVORITE_HABITATS,
  payload: { habitatId },
});

let interactionId = 0;
const newUserInteraction = (payload) => ({
  type: ADD_USER_INTERACTION,
  payload: { ...payload, interactionId },
});

const removeUserInteraction = () => ({ type: REMOVE_USER_INTERACTION });

export const addUserInteraction = (payload) => (dispatch, getState) => {
  const configs = get(getState(), 'habitat.habitatInfo.selectedCamera.configs', []);
  const { configValue: votingTime } = getConfig(configs, 'ptu.votingTime');

  interactionId += 1;
  dispatch(newUserInteraction(payload));
  setTimeout(() => dispatch(removeUserInteraction()),
    payload.ttl || Number(votingTime) + 1000);
}

export const toggleIsStreamPlaying = () => ({ type: TOGGLE_IS_STREAM_PLAYING });
export const toggleShowEmojiBasket = () => ({ type: TOGGLE_SHOW_EMOJI_BASKET });

let messageId = 0;

const addChatMessage = (channelId, messages) => ({
  type: ADD_MESSAGES,
  payload: { channelId, messages },
});

export const addMessages = (channelId, messages) => (dispatch) => {
  const messageList = messages.map((message) => {
    messageId += 1;
    return { ...message, messageId };
  });

  messageId += 1;
  dispatch(addChatMessage(channelId, messageList));
}

export const clearMessages = (channelId) => ({
  type: CLEAR_MESSAGES,
  payload: { channelId },
});

export const markMessageAsDeleted = (channelId, messageId) => ({
  type: MARK_MESSAGE_AS_DELETED,
  payload: { channelId, messageId },
})

export const toggleMessageReaction = (channelId, messageId, reaction, reactionId, userId) => ({
  type: TOGGLE_MESSAGE_REACTION,
  payload: {
    channelId,
    messageId,
    reaction,
    reactionId,
    userId,
  },
})

export const setReplyMessage = (timetoken, username, animal, color, text, channel) => ({
  type: SET_REPLY_MESSAGE,
  payload: {
    timetoken,
    username,
    text,
    animal,
    color,
    channel,
  },
});

export const clearReplyMessage = () => ({
  type: SET_REPLY_MESSAGE,
  payload: {
    timetoken: null,
    username: null,
    animal: null,
    color: null,
    text: null,
  },
});

export const showSnapshotShare = (show) => ({
  type: SHOW_SNAPSHOT_SHARE_POPUP,
  payload: { show },
});

export const setUserSessionChecked = () => ({ type: SET_SESSION_CHECHED });
export const unsetUserData = () => ({ type: UNSET_USER_DATA });

export const setPlans = (plans) => ({
  type: SET_PLANS,
  payload: { plans },
})

export const updateSubscription = (payload) => ({
  type: UPDATE_SUBSCRIPTION_DATA,
  payload,
});

export const toggleIsBroadcasting = () => ({ type: TOGGLE_IS_BROADCASTING });

export const updateReferralData = (referralData) => ({
  type: UPDATE_REFERRAL_DATA,
  payload: { referralData },
});

export const setHabitats = (habitats) => ({
  type: SET_HABITATS,
  payload: { habitats },
});

export const unsetHabitats = () => ({ type: UNSET_HABITATS });

export const updateHabitat = (habitatId, data) => ({
  type: UPDATE_HABITAT,
  payload: { habitatId, data },
});

export const setClipButtonClicked = (clicked) => ({
  type: UPDATE_CLIP_BUTTON_CLICKED,
  payload: { clicked },
});

export const setHabitatViewers = (viewers) => ({
  type: UPDATE_VIEWERS,
  payload: { viewers },
});
