import { get } from 'lodash-es';
import { SET_SHARE_MODAL_DATA, CLOSE_SHARE_MODAL } from './types';

export const closeShareModal = () => ({ type: CLOSE_SHARE_MODAL });

export const setShareModalData = (payload) => ({ type: SET_SHARE_MODAL_DATA, payload });

export const setShareModalMediaId = (mediaId) => (dispatch, getState) => {
  const state = getState();
  const album = get(state, 'habitat.album');
  let data;
  let nextId;
  let prevId;

  const index = album.list.findIndex(({ _id }) => _id === mediaId);
  if (index >= 0) {
    data = album.list[index];
    nextId = index + 1 < album.list.length ? album.list[index + 1]._id : null;
    prevId = index - 1 >= 0 ? album.list[index - 1]._id : null;
  }

  dispatch(setShareModalData({
    mediaId,
    data,
    nextId,
    prevId,
  }))
};
