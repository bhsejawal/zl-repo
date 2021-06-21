import { cloneElement, h, toChildArray } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { buildURL } from 'Shared/fetch';
import useFetch, { Provider as UseFetchProvider } from 'use-http';

import AppLoader from 'Components/AppLoader';
import { setUserData, setUserSessionChecked, unsetUserData } from '../../redux/actions';
import { hasPermission } from '.';
import { authRedirect } from './helpers';
import { getDeviceType, identifyUser } from '../../helpers';

import ErrorPage from '../ErrorPage';

const AuthGuard = ({
  permission,
  role,
  active,
  sessionChecked,
  adminOnly,
  guestOnly,
  phoneOnly,
  // display fallback component if user is not authorized
  fallback,
  children,
  redirectTo,
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
    [permission, sessionChecked, active],
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
          if (!guestOnly) {
            authRedirect();
          }
        }
        return response;
      },
    },
  }), [unsetUserDataAction, guestOnly]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!sessionChecked) {
        await get();

        if (response.ok) {
          setUserDataAction(response.data);
          identifyUser(response.data);
        } else if (response.status === 401) {
          unsetUserDataAction();
          if (!guestOnly) {
            authRedirect();
          }
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
    guestOnly,
  ]);

  if ((!adminOnly && !permission && !guestOnly && !phoneOnly)
  || (adminOnly && permission && !guestOnly && !phoneOnly)) {
    throw new Error('AuthGuard expects either "adminOnly", "permission", "phoneOnly", "guestOnly" prop.');
  } else if (adminOnly && guestOnly) {
    throw new Error('AuthGuard should receive either Admin Only OR Guest Only');
  }

  if (error) {
    return (
      <ErrorPage
        error="500"
        message="Oops! Something went wrong."
        url={props.path}
      />
    );
  }

  const mappedChildren = toChildArray(children)
    .map((child) => child && cloneElement(child, props));

  if ((sessionChecked && role === 'admin' && adminOnly)
    || (sessionChecked && !adminOnly && authorized)
    || (sessionChecked && role === 'guest' && guestOnly)
    || (sessionChecked && phoneOnly && getDeviceType() === 'phone' && authorized)
  ) {
    return (
      <UseFetchProvider options={useFetchOptions}>
        {mappedChildren}
      </UseFetchProvider>
    );
  }

  if (sessionChecked && !authorized) {
    if (redirectTo) {
      return authRedirect(redirectTo);
    }

    return fallback || (
      <ErrorPage
        error="403"
        message="Sorry, you don&apos;t have access to this page."
        url={props.path}
      />
    );
  }

  return (
    <AppLoader />
  );
};

export default connect(
  ({
    user: {
      role,
      sessionChecked,
      subscription: { active },
    },
  }) => ({ role, sessionChecked, active }),
  {
    setUserDataAction: setUserData,
    setSessionChechedAction: setUserSessionChecked,
    unsetUserDataAction: unsetUserData,
  },
)(AuthGuard);
