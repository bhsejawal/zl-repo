import { buildURL, get } from 'Shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const getUser = () => {
  const url = buildURL('/admin/users/user');
  return get(url);
};
