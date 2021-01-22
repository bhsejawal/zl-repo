import { buildURL, get } from '../../../../shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const fetchCards = (cameraId, tab) => {
  const url = buildURL(`/cameras/${cameraId}/cards/tabs/${tab}`);
  return get(url);
};
