import { SET_PLANS } from '../types';

const initialState = {
  plans: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PLANS: {
      const { plans } = payload;
      return {
        ...state,
        plans,
      }
    }
    default: {
      return state;
    }
  }
};
