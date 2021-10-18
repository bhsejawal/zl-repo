import {
  SCHEDULE_SHOW_ADD_EVENT_MODAL,
  SCHEDULE_SHOW_EDIT_EVENT_MODAL,
  SCHEDULE_SHOW_DELETE_EVENT,
  SCHEDULE_SET_DELETE_MULTIPLE,
} from './types';

export const showAddEventModal = (show) => ({
  type: SCHEDULE_SHOW_ADD_EVENT_MODAL,
  payload: { show },
});

export const showEditEventModal = (show, event) => ({
  type: SCHEDULE_SHOW_EDIT_EVENT_MODAL,
  payload: { show, event },
});

export const showDeleteEventModal = (show, multiple, freqHidden) => ({
  type: SCHEDULE_SHOW_DELETE_EVENT,
  payload: { show, multiple, freqHidden },
});

export const setDeleteMultiple = (multiple) => ({
  type: SCHEDULE_SET_DELETE_MULTIPLE,
  payload: { multiple },
});
