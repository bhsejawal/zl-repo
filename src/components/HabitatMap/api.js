import { handleResponse } from '../../shared/fetch'; // add to helper

// eslint-disable-next-line import/prefer-default-export
export const getMapData = () => fetch(
  `${process.env.PREACT_APP_HTTP_PROTOCOL}${process.env.PREACT_APP_API_AUTHORITY}/admin/habitats/map`,
  {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  },
).then(handleResponse);
