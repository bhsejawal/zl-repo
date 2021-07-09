import { SHOW_SCHEDULE_MODAL, CLOSE_SCHEDULE_MODAL } from './types';

const initialState = {
  id: null,
  show: false,
  startTime: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_SCHEDULE_MODAL: {
      const { id, startTime } = payload;

      return {
        id,
        show: true,
        startTime,
      };
    }

    case CLOSE_SCHEDULE_MODAL: {
      return { initialState };
    }

    default: {
      return state;
    }
  }
};
