import { buildURL, get } from 'Shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const fetchCards = (habitatId, tab) => {
  const url = buildURL(`/habitats/${habitatId}/cards/tabs/${tab}`);
  return get(url);
};
