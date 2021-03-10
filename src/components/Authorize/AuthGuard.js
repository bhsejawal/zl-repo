import { cloneElement, h, toChildArray } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { buildURL } from 'Shared/fetch';
import { Box, Text, Heading } from 'grommet';
import useFetch, { Provider as UseFetchProvider } from 'use-http';

import { setUserData, setUserSessionChecked, unsetUserData } from '../../redux/actions';
import { hasPermission } from '.';
import { authRedirect } from './helpers';

import style from './style.scss';

const AuthGuard = ({
  permission,
  role,
  sessionChecked,
  adminOnly,
  // display fallback component if user is not authorized
  fallback,
  children,
  setUserDataAction,
  setSessionChechedAction,
  unsetUserDataAction,
  // we need to pass this to children
  // because we'll have props added by preact router or some other parent
  ...props
}) => {
  const [error, setError] = useState();
  const authorized = useMemo(
    () => hasPermission(permission),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permission, sessionChecked],
  );
  const { get, response } = useFetch(
    buildURL('/admin/users/user'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const useFetchOptions = useMemo(() => ({
    interceptors: {
      response: async ({ response }) => {
        if (response.status === 401) {
          unsetUserDataAction();
          authRedirect();
        }
        return response;
      },
    },
  }), [unsetUserDataAction]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!sessionChecked) {
        await get();

        if (response.ok) {
          setUserDataAction(response.data);
        } else if (response.status === 401) {
          authRedirect();
          unsetUserDataAction();
        } else {
          setError(true);
          setSessionChechedAction();
        }
      }
    };

    loadUserData();
  }, [
    get,
    response,
    sessionChecked,
    setSessionChechedAction,
    setUserDataAction,
    unsetUserDataAction,
  ]);

  if ((!adminOnly && !permission) || (adminOnly && permission)) {
    throw new Error('AuthGuard expects either "adminOnly" or "permission" prop.');
  }

  if (error) {
    // TODO: update UI when we have styling for this
    return (
      <Box fill justify="center" align="center">
        <Heading level="1">Uh oh!</Heading>
        <Text size="large">Something went wrong.</Text>
        <Text size="large">Please try again.</Text>
      </Box>
    );
  }

  const mappedChildren = toChildArray(children)
    .map((child) => child && cloneElement(child, props));
  if ((sessionChecked && role === 'admin' && adminOnly)
    || (sessionChecked && !adminOnly && authorized)) {
    return (
      <UseFetchProvider options={useFetchOptions}>
        {mappedChildren}
      </UseFetchProvider>
    );
  }

  if (sessionChecked && !authorized) {
    return fallback || (
      <Box fill justify="center" align="center">
        <Heading level="1">Uh oh!</Heading>
        <Text size="large">You are not authorized to see this content.</Text>
        <Text size="large">Please contact your administrator.</Text>
      </Box>
    );
  }

  // TODO: we might wanna change this and have something nicer
  return (
    <div className={style.appLoader}>
      Loading...
    </div>
  );
};

export default connect(
  ({ user: { role, sessionChecked } }) => ({ role, sessionChecked }),
  {
    setUserDataAction: setUserData,
    setSessionChechedAction: setUserSessionChecked,
    unsetUserDataAction: unsetUserData,
  },
)(AuthGuard);
