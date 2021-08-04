import {
  SET_HABITAT_PROPS,
  SET_HABITAT,
  SET_HABITAT_LIKED,
  UNSET_HABITAT,
  SET_HABITAT_STREAM_STARTED,
} from './types';

export const setHabitat = ({ habitat }) => ({
  type: SET_HABITAT,
  payload: {
    habitat: {
      ...habitat,
      streamKey: habitat.streamKey
        || habitat?.camera?.channelSettings?.[0]?.streamKey,
      hostStreamKey: habitat.hostStreamKey
        || habitat.camera?.channelSettings?.[0]?.hostKey,
    },
  },
});

export const setHabitatLiked = (isLiked) => ({
  type: SET_HABITAT_LIKED,
  payload: { isLiked },
});

export const unsetHabitat = () => ({ type: UNSET_HABITAT });

export const setHabitatProps = (payload) => ({
  type: SET_HABITAT_PROPS,
  payload,
});

export const setHabitatStreamStarted = (streamStarted) => ({
  type: SET_HABITAT_STREAM_STARTED,
  payload: { streamStarted },
});
