import {
  SET_SESSION_CHECHED,
  SET_USER_DATA,
  SET_USER_PROFILE,
  UNSET_USER_DATA,
} from '../types';

const initialState = {
  logged: false,
  userId: null,
  sessionChecked: false,
  // This will be for Viewers
  subscription: {
    active: true,
    // should be used for the Trial/track how long the user can watch the videos
    validUntil: new Date(),
  },
  email: null,
  username: null,
  // Valid: [guest, viewer, partner, host, admin]
  // Default value will be Guest once we go live
  role: undefined,
  // This needs to be the zooId ONLY for Partners
  // IT needs to be undefined for Hosts
  zooId: 'torontozoo',
  // This needs to be list of habitats that a Host can stream to
  // Should be undefined for Hosts
  habitats: ['mockCamID'],
  // used to store icon, color and nickname,
  // and other UI user settings
  profile: undefined,
};

export default (state = initialState, { type, payload }) => {
  if (type === SET_USER_DATA) {
    const {
      email,
      username,
      permissions,
      role,
      userId,
      profile,
    } = payload;

    return {
      ...state,
      role,
      email,
      username,
      permissions,
      sessionChecked: true,
      logged: true,
      userId,
      profile: profile || initialState.profile,
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

  if (type === SET_USER_PROFILE) {
    const { profile } = payload;
    return {
      ...state,
      profile,
    }
  }

  if (type === SET_SESSION_CHECHED) {
    return {
      ...state,
      sessionChecked: true,
    }
  }

  return state;
};
