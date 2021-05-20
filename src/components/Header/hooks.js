import { route } from "preact-router";
import useFetch from "use-http";

import { buildURL } from "Shared/fetch";

// eslint-disable-next-line import/prefer-default-export
export const useLogout = (onLogout) => {
  const { post, response } = useFetch(
    buildURL('/admin/users/logout'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  return async () => {
    await post();
    if (response.ok) {
      onLogout?.();
      route('/login');
    }
  };
};
