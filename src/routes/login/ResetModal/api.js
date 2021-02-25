import { buildURL, post } from 'Shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const validateToken = async (token) => {
  const url = buildURL('/users/password/validate');
  return post(url, { token });
};
