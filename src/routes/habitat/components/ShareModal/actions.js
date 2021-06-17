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

  Object.entries(album).forEach(([key, value]) => {
    const index = value.list.findIndex(({ _id }) => _id === mediaId);
    if (index >= 0) {
      data = album[key].list[index];
      nextId = index + 1 < value.list.length ? value.list[index + 1]._id : null;
      prevId = index - 1 >= 0 ? value.list[index - 1]._id : null;
    }
  });

  dispatch(setShareModalData({
    mediaId,
    data,
    nextId,
    prevId,
  }))
};
