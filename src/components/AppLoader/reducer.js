import { SHOW_APP_LOADER, HIDE_APP_LOADER } from './types';

const initialState = {
  show: true,
};

export default (state = initialState, { type }) => {
  switch (type) {
    case SHOW_APP_LOADER: {
      return { ...state, show: true };
    }

    case HIDE_APP_LOADER: {
      return { ...state, show: false };
    }

    default: {
      return state;
    }
  }
};
