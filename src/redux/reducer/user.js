import {
  SET_SESSION_CHECHED,
  SET_USER_DATA,
  SET_USER_PROFILE,
  UPDATE_SUBSCRIPTION_DATA,
  UNSET_USER_DATA,
} from '../types';

const initialState = {
  logged: false,
  userId: null,
  sessionChecked: false,
  // This will be for Viewers
  subscription: {
    active: null,
    validUntil: null,
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
  habitats: [],
  // used to store icon, color and nickname,
  // and other UI user settings
  profile: undefined,
};

export default (state = initialState, { type, payload }) => {
  if (type === SET_USER_DATA) {
    const { profile, subscriptionStatus: subscription = {}, ...rest } = payload;

    return {
      ...state,
      ...rest,
      sessionChecked: true,
      logged: true,
      profile: profile || initialState.profile,
      subscription: {
        ...state.subscription,
        ...subscription,
        active: subscription.validUntil && new Date(subscription.validUntil) > new Date(),
      },
    }
  }

  if (type === UNSET_USER_DATA) {
    return {
      ...state,
      role: initialState.role,
      permissions: initialState.permissions,
      username: initialState.username,
      logged: initialState.logged,
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

  if (type === UPDATE_SUBSCRIPTION_DATA) {
    return {
      ...state,
      subscription: {
        ...state.subscription,
        ...payload,
      },
    }
  }

  return state;
};
