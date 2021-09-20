import { SHOW_CAMERA_CONTROL_MODAL } from './types';

const initialState = {
  show: false,
  type: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_CAMERA_CONTROL_MODAL: {
      const { show, type } = payload;

      return { ...state, show, type };
    }

    default: {
      return state;
    }
  }
};
