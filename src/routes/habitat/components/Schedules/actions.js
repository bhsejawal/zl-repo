import { SET_LIVE_TALKS, SET_LIVE_STREAMS } from './types';

export const setLiveTalks = (list) => ({
  type: SET_LIVE_TALKS,
  payload: { list },
});

export const setSchedules = (list) => {
  const liveStreams = list.filter(({ eventType }) => (eventType === 'live'));
  return { type: SET_LIVE_STREAMS, payload: { liveStreams }};
};
