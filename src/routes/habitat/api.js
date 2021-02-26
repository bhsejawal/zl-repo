import { buildURL, get } from 'Shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const getHabitat = (zoo, slug) => {
  const url = buildURL(`/${zoo}/${slug}`);
  return get(url);
};
