import { buildURL, get, patch } from "../../shared/fetch";

export const getUser = () => {
  // TODO: we should change this since we'll have the same endpoint for
  // all users - admin and non admin
  const url = buildURL('/admin/users/user');
  return get(url);
};

export const updateUser = (color, animalIcon, username) => {
  const url = buildURL('/users/profile');
  return patch(url, { color, animalIcon, username });
};
