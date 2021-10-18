import { SET_LIVE_STREAMS, SET_LIVE_TALKS } from './types';

const initialState = {
  liveTalks: [],
  liveStreams: [],
};

export default (state = initialState, action = {}) => {
  const { type, payload = {} } = action;

  switch (type) {
    case SET_LIVE_TALKS: {
      const { list } = payload;
      return {
        ...state,
        liveTalks: list,
      };
    }

    case SET_LIVE_STREAMS: {
      const { liveStreams } = payload;
      return {
        ...state,
        liveStreams,
      };
    }

    default: {
      return state;
    }
  }
};
