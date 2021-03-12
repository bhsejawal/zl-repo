import {
  SET_HABITAT_PROPS,
  SET_HABITAT,
  SET_HABITAT_LIKED,
  UNSET_HABITAT,
} from '../types';

const initialState = {};

export default (state = initialState, { type, payload = {}}) => {
  switch (type) {
    case SET_HABITAT: {
      const { habitat } = payload;
      return {
        ...state,
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

    default: {
      return state;
    }
  }
};
