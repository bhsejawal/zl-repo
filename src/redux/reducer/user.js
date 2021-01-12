import { SET_USER_DATA, UNSET_USER_DATA } from "../types";

const initialState = {
  logged: false,
  sessionChecked: false,
  username: null,
  // I guess we'll have something like this
  // that will tell us if user is a viewer, moderator, admin, etc.
  role: undefined,
  // this could be something like a mapping of zoos and permissions
  // empty if user has no permissions
  permissions: [],

  // currently holding mock data. This should be stored in db
  viewer: {
    animal: 'dog',
    color: '#7033ff',
  },
};

export default (state = initialState, { type, payload }) => {
  if (type === SET_USER_DATA) {
    const { username, permissions, role } = payload;

    return {
      ...state,
      role,
      username,
      permissions,
      sessionChecked: true,
      logged: true,
    }
  }

  if (type === UNSET_USER_DATA) {
    return {
      ...state,
      role: initialState.role,
      permissions: initialState.permissions,
      username: initialState.username,
      sessionChecked: false,
    }
  }

  return state;
};
