import urlJoin from 'url-join';

import { authRedirect } from 'Components/Authorize/helpers';
import store from '../redux/store';
import { unsetUserData } from '../redux/actions';

const baseUrl = '/api';

export const API_BASE_URL = baseUrl;

export const buildURL = (...args) => urlJoin(baseUrl, ...args);

export class RequestError extends Error {
  constructor(statusCode, body) {
    super(`Request failed with status code: ${statusCode}`);
    this.statusCode = statusCode;
    this.body = body;
  }
}

export const handleResponse = async (response) => {
  if (response.status === 401) {
    store.dispatch(unsetUserData());
    authRedirect();
  }

  if (!response.ok) {
    throw new RequestError(response.status, await response.json());
  }

  if (response.status === 204 || response.status === 201) {
    return undefined;
  }

  return response.json();
};

export const post = async (url, data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse(res);
};

export const patch = async (url, data = {}) => {
  const res = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse(res);
};

export const callDelete = async (url, data) => {
  const res = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse(res);
};

export const get = async (url) => {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse(res);
};

export const put = async (url, data = {}) => {
  const res = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  return handleResponse(res);
};
