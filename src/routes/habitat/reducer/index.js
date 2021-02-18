import { LOAD_HABITAT_SETTINGS } from '../types';

const initialState = {
  habitatId: '60257af51cf87a9d09c5dbd9',
  zooId: 'torontozoo',
  isFetching: false,
  weather: undefined,
  timezone: undefined,
  location: undefined,
  error: undefined,
};

export default (state = initialState, { type, payload = {}}) => {
  switch (type) {
    case LOAD_HABITAT_SETTINGS: {
      const { error, habitat = {} } = payload;
      const { weather, timezone, location } = habitat;
      return {
        ...state,
        isFetching: !error && !habitat,
        error: error || state.error,
        weather: weather || state.weather,
        timezone: timezone || state.timezone,
        location: location || state.location,
      };
    }
    default: {
      return state;
    }
  }
};
