import {
  SET_DELETE_MULTIPLE_SCHEDULE_MODAL,
  SHOW_ADD_EVENT_SCHEDULE_MODAL,
  SHOW_DELETE_EVENT_SCHEDULE_MODAL,
  SHOW_EDIT_EVENT_SCHEDULE_MODAL,
} from './types';

const initialState = {
  showAddEventModal: false,
  showEditEventModal: false,
  showDeleteEventModal: false,
  deleteModal: {
    isOpen: false,
    multiple: false,
  },
  event: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_ADD_EVENT_SCHEDULE_MODAL: {
      const { show } = payload;
      return { ...state, showAddEventModal: show };
    }

    case SHOW_EDIT_EVENT_SCHEDULE_MODAL: {
      const { show, event } = payload;
      return { ...state, showEditEventModal: show, event };
    }

    case SHOW_DELETE_EVENT_SCHEDULE_MODAL: {
      const { show: isOpen, multiple, freqHidden } = payload;
      return {
        ...state,
        showEditEventModal: false,
        deleteModal: {
          ...state.deleteModal,
          isOpen,
          multiple,
          freqHidden,
        },
      };
    }

    case SET_DELETE_MULTIPLE_SCHEDULE_MODAL: {
      const { multiple } = payload;
      return {
        ...state,
        deleteModal: {
          ...state.deleteModal,
          multiple,
        },
      };
    }

    default: {
      return state;
    }
  }
};
