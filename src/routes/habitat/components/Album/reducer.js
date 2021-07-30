import { SET_ALBUM_DATA, APPEND_ALBUM_DATA, CHANGE_CONTENT_VISIBILITY } from './types';

const initialState = {
  total: null,
  list: [],
  type: 'PHOTOS',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ALBUM_DATA: {
      const { data } = payload;

      return { ...state, ...data };
    }

    case APPEND_ALBUM_DATA: {
      const { data } = payload;

      return {
        ...state,
        total: data.total,
        list: [...state.list, ...data.list],
      };
    }
    case CHANGE_CONTENT_VISIBILITY: {
      const { mediaId, mediaType, action } = payload;
      const disabled = action === 'hide';

      return {
        ...state,
        [mediaType]: {
          ...state,
          list: state.list.map((media) => (
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
