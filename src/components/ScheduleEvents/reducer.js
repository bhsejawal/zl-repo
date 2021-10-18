import {
  SCHEDULE_SHOW_ADD_EVENT_MODAL,
  SCHEDULE_SHOW_EDIT_EVENT_MODAL,
  SCHEDULE_SHOW_DELETE_EVENT,
  SCHEDULE_SET_DELETE_MULTIPLE,
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
    case SCHEDULE_SHOW_ADD_EVENT_MODAL: {
      const { show } = payload;
      return { ...state, showAddEventModal: show };
    }

    case SCHEDULE_SHOW_EDIT_EVENT_MODAL: {
      const { show, event } = payload;
      return { ...state, showEditEventModal: show, event };
    }

    case SCHEDULE_SHOW_DELETE_EVENT: {
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

    case SCHEDULE_SET_DELETE_MULTIPLE: {
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
