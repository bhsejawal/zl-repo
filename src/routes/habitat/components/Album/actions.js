import { SET_ALBUM_DATA, APPEND_ALBUM_DATA, CHANGE_CONTENT_VISIBILITY } from './types';

export const appendAlbumData = (data, type) => ({
  type: APPEND_ALBUM_DATA,
  payload: { data, type },
});

export const setAlbumData = (data) => ({
  type: SET_ALBUM_DATA,
  payload: { data },
});

export const changeContentVisibility = (mediaId, mediaType, action) => ({
  type: CHANGE_CONTENT_VISIBILITY,
  payload: { mediaId, mediaType, action },
});
