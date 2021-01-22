import {
  buildURL,
  callDelete,
  patch,
  post,
} from '../../../../../../../shared/fetch';

export const createCard = (cameraId, type, tab, tag, data) => {
  const url = buildURL(`/admin/cameras/${cameraId}/cards/tabs/${tab}`);
  return post(url, { type, tag, data });
};

export const updateCard = (cardId, tag, data) => {
  const url = buildURL(`/admin/cards/${cardId}`);
  return patch(url, { tag, data });
};

export const deleteCard = (cardId) => {
  const url = buildURL(`/admin/cards/${cardId}`);
  return callDelete(url);
};
