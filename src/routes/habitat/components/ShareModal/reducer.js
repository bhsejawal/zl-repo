import { SET_SHARE_MODAL_DATA, CLOSE_SHARE_MODAL } from './types';

const initialState = {
  open: false,
  mediaId: null,
  nextId: null,
  prevId: null,
  data: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SHARE_MODAL_DATA: {
      const {
        mediaId,
        nextId,
        prevId,
        data,
      } = payload;

      return {
        ...state,
        open: true,
        mediaId,
        nextId,
        prevId,
        data,
      };
    }

    case CLOSE_SHARE_MODAL: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
