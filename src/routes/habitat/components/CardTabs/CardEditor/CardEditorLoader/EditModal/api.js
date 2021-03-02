import {
  buildURL,
  callDelete,
  patch,
  post,
} from 'Shared/fetch';

export const createCard = (habitatId, type, tab, tag, index, data) => {
  const url = buildURL(`/admin/habitats/${habitatId}/cards/tabs/${tab}`);
  return post(url, {
    type,
    tag,
    index,
    data,
  });
};

export const updateCard = (cardId, tag, index, data) => {
  const url = buildURL(`/admin/cards/${cardId}`);
  return patch(url, { tag, index, data });
};

export const deleteCard = (cardId) => {
  const url = buildURL(`/admin/cards/${cardId}`);
  return callDelete(url);
};
