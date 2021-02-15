import {
  SET_DATE_FILTER,
  SET_ZOO_FILTER,
  SET_ANIMAL_FILTER,
  SET_TIME_FILTER,
  TOGGLE_ANIMAL_FILTER,
  TOGGLE_ZOO_FILTER,
  TOGGLE_DATE_FILTER,
  TOGGLE_TIME_FILTER,
  SET_FILTER_OPTIONS,
} from '../types';

const initialState = {
  availableZoos: [],
  availableAnimals: [],
  availableDates: [],
  filters: {
    showAnimalFilter: false,
    animals: [],
    showZooFilter: false,
    zoos: [],
    showDateFilter: false,
    date: new Date(),
    time: {
      startTime: null,
      endTime: null,
    },
    showTimeFilter: false,
  },
  sessions: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTER_OPTIONS: {
      const { animals, zoos, dates } = payload;
      return {
        ...state,
        availableAnimals: animals,
        availableZoos: zoos,
        availableDates: dates,
      }
    }
    case TOGGLE_ANIMAL_FILTER: {
      return {
        ...state,
        filters: {
          ...state.filters,
          showAnimalFilter: !state.filters.showAnimalFilter,
        },
      }
    }
    case TOGGLE_ZOO_FILTER: {
      return {
        ...state,
        filters: {
          ...state.filters,
          showZooFilter: !state.filters.showZooFilter,
        },
      }
    }
    case TOGGLE_DATE_FILTER: {
      return {
        ...state,
        filters: {
          ...state.filters,
          showDateFilter: !state.filters.showDateFilter,
        },
      }
    }
    case TOGGLE_TIME_FILTER: {
      return {
        ...state,
        filters: {
          ...state.filters,
          showTimeFilter: !state.filters.showTimeFilter,
        },
      }
    }
    case SET_TIME_FILTER: {
      const { startTime, endTime } = payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          time: {
            startTime,
            endTime,
          },
          showTimeFilter: false,
        },
      };
    }
    case SET_ZOO_FILTER: {
      const { zoos } = payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          zoos,
          showZooFilter: false,
        },
      };
    }
    case SET_ANIMAL_FILTER: {
      const { animals } = payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          animals,
          showAnimalFilter: false,
        },
      };
    }
    case SET_DATE_FILTER: {
      const { date } = payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          date,
          showDateFilter: false,
        },
      };
    }
    default: {
      return state;
    }
  }
};
