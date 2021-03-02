import { SET_USER_DATA, SET_USER_PROFILE, UNSET_USER_DATA } from "../types";

import animal1 from '../../assets/profileIcons/animal1.svg';

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
  username: null,
  // Valid: [guest, viewer, partner, host, admin]
  // Default value will be Guest once we go live
  role: 'admin',
  // This needs to be the zooId ONLY for Partners
  // IT needs to be undefined for Hosts
  zooId: 'torontozoo',
  // This needs to be list of habitats that a Host can stream to
  // Should be undefined for Hosts
  habitats: ['mockCamID'],
  // used to store icon, color and nickname,
  // and other UI user settings
  // NOTE: this is mock data, and it should always be set from UI before used
  // TODO: We need to define what will be the profile data for admin, hosts, and zoo.
  profile: {
    color: '#FFB145',
    animalIcon: animal1,
    nickname: 'placeholderNickname',
  },
};

export default (state = initialState, { type, payload }) => {
  if (type === SET_USER_DATA) {
    const {
      username,
      permissions,
      role,
      userId,
      profile,
    } = payload;

    return {
      ...state,
      role,
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

  return state;
};
