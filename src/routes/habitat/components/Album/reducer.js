import { SET_ALBUM_DATA, APPEND_ALBUM_DATA } from './types';

const initialState = {
  photos: {
    total: null,
    list: [],
  },
  pastTalks: {
    total: null,
    list: [],
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ALBUM_DATA: {
      const { data } = payload;

      return { ...state, ...data };
    }

    case APPEND_ALBUM_DATA: {
      const { data, type } = payload;

      return {
        ...state,
        [type]: {
          ...state[type],
          total: data[type].total,
          list: [...state[type].list, ...data[type].list],
        },
      };
    }

    default: {
      return state;
    }
  }
};
