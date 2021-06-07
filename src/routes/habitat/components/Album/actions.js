import { SET_ALBUM_DATA, APPEND_ALBUM_DATA } from './types';

export const appendAlbumData = (data, type) => ({
  type: APPEND_ALBUM_DATA,
  payload: { data, type },
});

export const setAlbumData = (data) => ({
  type: SET_ALBUM_DATA,
  payload: { data },
});
