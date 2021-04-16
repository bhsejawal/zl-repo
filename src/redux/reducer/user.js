import { SET_TERMS_ACCEPTED } from 'Components/TermsAndConditions/types';
import {
  SET_SESSION_CHECHED,
  SET_USER_DATA,
  SET_USER_PROFILE,
  UPDATE_SUBSCRIPTION_DATA,
  UNSET_USER_DATA,
  SET_SUBSCRIPTION_DATA,
  UPDATE_FAVORITE_HABITATS,
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
  // Valid: [guest, user, vip, partner, host, admin]
  // Default value will be Guest once we go live
  role: null,
  // This needs to be the zooId ONLY for Partners
  // IT needs to be undefined for Hosts
  zooId: 'torontozoo',
  // This needs to be list of habitats that a Host can stream to
  // Should be undefined for Hosts
  habitats: [],
  favoriteHabitats: [],
  // used to store icon, color,
  // and other UI user settings
  profile: undefined,
  isOnboarded: false,
  termsAccepted: null,
};

export default (state = initialState, { type, payload }) => {
  if (type === SET_SUBSCRIPTION_DATA) {
    const { validUntil } = payload;

    const validUntilDate = validUntil ? new Date(validUntil) : null;
    return {
      ...state,
      subscription: {
        ...state.subscription,
        ...payload,
        validUntil: validUntilDate,
      },

    }
  }

  if (type === SET_USER_DATA) {
    const {
      profile,
      subscriptionStatus: subscription = {},
      termsAcceptance,
      ...rest
    } = payload;
    const { validUntil } = subscription;

    const validUntilDate = validUntil ? new Date(validUntil) : null;

    return {
      ...state,
      ...rest,
      sessionChecked: true,
      logged: true,
      profile: profile || initialState.profile,
      // TODO: implement versioning when we need it
      termsAccepted: termsAcceptance.length !== 0,
      subscription: {
        ...state.subscription,
        ...subscription,
        active: subscription.validUntil && new Date(subscription.validUntil) > new Date(),
        validUntil: validUntilDate,
      },
    }
  }

  if (type === UNSET_USER_DATA) {
    return {
      ...state,
      ...initialState,
      role: 'guest',
      sessionChecked: true,
    }
  }

  if (type === SET_USER_PROFILE) {
    const { profile, username } = payload;
    return {
      ...state,
      profile,
      username,
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

  if (type === SET_TERMS_ACCEPTED) {
    return {
      ...state,
      termsAccepted: true,
    };
  }

  if (type === UPDATE_FAVORITE_HABITATS) {
    const { habitatId } = payload;
    const { favoriteHabitats } = state;

    const isHabitatFavorited = favoriteHabitats.includes(habitatId);
    const newFavHabitats = isHabitatFavorited ? favoriteHabitats.filter((id) => id !== habitatId)
      : [...favoriteHabitats, habitatId];

    return {
      ...state,
      favoriteHabitats: newFavHabitats,
    }
  }

  return state;
};
