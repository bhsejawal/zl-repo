import { SET_ALBUM_DATA, APPEND_ALBUM_DATA, CHANGE_CONTENT_VISIBILITY } from './types';

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
    case CHANGE_CONTENT_VISIBILITY: {
      const { mediaId, mediaType, action } = payload;
      const disabled = action === 'hide';
      console.log(mediaId, mediaType, action);
      return {
        ...state,
        [mediaType]: {
          ...state[mediaType],
          list: state[mediaType].list.map((media) => (
            media._id === mediaId ? { ...media, disabled } : media
          )),
        },
      };
    }
    default: {
      return state;
    }
  }
};
