import {
  SET_HABITAT_PROPS,
  SET_HABITAT,
  SET_HABITAT_LIKED,
  UNSET_HABITAT,
  SET_HABITAT_STREAM_STARTED,
  SET_SELECTED_CAMERA,
  UPDATE_AVAILABLE_CAMERAS,
} from '../types';

const initialState = {};

export default (state = initialState, { type, payload = {}}) => {
  switch (type) {
    case SET_HABITAT: {
      const { habitat } = payload;
      return {
        ...initialState,
        ...habitat,
      };
    }

    case UNSET_HABITAT: {
      return initialState;
    }

    case SET_HABITAT_LIKED: {
      const { isLiked } = payload;
      return { ...state, isLiked };
    }

    case SET_HABITAT_PROPS: {
      return {
        ...state,
        ...payload,
      };
    }

    case SET_HABITAT_STREAM_STARTED: {
      const { streamStarted } = payload;
      return { ...state, streamStarted };
    }

    case SET_SELECTED_CAMERA: {
      const { camera } = payload;
      return { ...state, selectedCamera: camera };
    }

    case UPDATE_AVAILABLE_CAMERAS: {
      const { availableCameras } = payload;
      return {
        ...state,
        cameras: availableCameras,
        selectedCamera: availableCameras.some(({ _id }) => _id === state.selectedCamera._id)
          ? state.selectedCamera : availableCameras[0],
      }
    }

    default: {
      return state;
    }
  }
};
