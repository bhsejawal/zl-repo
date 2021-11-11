import {
  SET_HABITAT_PROPS,
  SET_HABITAT,
  SET_HABITAT_LIKED,
  UNSET_HABITAT,
  SET_HABITAT_STREAM_STARTED,
  SET_SELECTED_CAMERA,
  UPDATE_AVAILABLE_CAMERAS,
} from './types';

export const setHabitat = ({ habitat }) => ({
  type: SET_HABITAT,
  payload: {
    habitat: {
      ...habitat,
      selectedCamera: habitat?.cameras[0],
      streamKey: habitat?.cameras[0]?.channelSettings?.[0]?.streamKey,
      hostStreamKey: habitat.hostStreamKey,
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

export const setSelectedCamera = (camera) => ({
  type: SET_SELECTED_CAMERA,
  payload: { camera },
});

export const handleCameraUpdate = (availableCameras) => ({
  type: UPDATE_AVAILABLE_CAMERAS,
  payload: { availableCameras },
})
