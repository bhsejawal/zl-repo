import { SHOW_SCHEDULE_MODAL, CLOSE_SCHEDULE_MODAL } from './types';

export const showScheduleModal = (id, startTime) => ({
  type: SHOW_SCHEDULE_MODAL,
  payload: { id, startTime },
});

export const closeScheduleModal = () => ({
  type: CLOSE_SCHEDULE_MODAL,
});
