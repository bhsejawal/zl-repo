import {
  SHOW_ADD_EVENT_SCHEDULE_MODAL,
  SHOW_EDIT_EVENT_SCHEDULE_MODAL,
  SHOW_DELETE_EVENT_SCHEDULE_MODAL,
  SET_DELETE_MULTIPLE_SCHEDULE_MODAL,
} from './types';
import { setActiveTab } from '../../actions';
import { CALENDAR } from '../../constants';

export const showAddEventModal = (show) => ({
  type: SHOW_ADD_EVENT_SCHEDULE_MODAL,
  payload: { show },
});

export const showEditEventModal = (show, event) => ({
  type: SHOW_EDIT_EVENT_SCHEDULE_MODAL,
  payload: { show, event },
});

export const showDeleteEventModal = (show, multiple, freqHidden) => ({
  type: SHOW_DELETE_EVENT_SCHEDULE_MODAL,
  payload: { show, multiple, freqHidden },
});

export const setDeleteMultiple = (multiple) => ({
  type: SET_DELETE_MULTIPLE_SCHEDULE_MODAL,
  payload: { multiple },
});

// TODO move calendar events to redux and update calendar properly
export const updateCalendar = () => (dispatch) => {
  // changing tabs will force calendar to reload, this is a temp solution
  dispatch(setActiveTab(null));
  setTimeout(() => dispatch(setActiveTab(CALENDAR)), 10);
}
