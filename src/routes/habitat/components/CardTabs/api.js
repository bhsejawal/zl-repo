import { buildURL, get } from 'Shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const fetchCards = (cameraId, tab) => {
  const url = buildURL(`/cameras/${cameraId}/cards/tabs/${tab}`);
  return get(url);
};
