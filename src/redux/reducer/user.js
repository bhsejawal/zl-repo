import { SET_USER_DATA, UNSET_USER_DATA } from "../types";
import { generateUserData } from '../../helpers';

// mock data for test, will generate random user, color and animal on every load
const initialViewer = generateUserData();

const initialState = {
  logged: false,
  sessionChecked: false,
  // This will be for Viewers
  subscription: {
    isActive: true,
    // daily/monthly
    type: 'monthly',
    // should be used for the Trial/track how long the user can watch the videos
    expireDate: new Date(),
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
  // currently holding mock data. This should be stored in db
  viewer: initialViewer,
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
