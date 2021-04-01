import {
  ADD_HABITAT_CARD,
  DELETE_HABITAT_CARD,
  UPDATE_HABITAT_CARD,
} from '../../../types';

export const addCard = (card) => ({
  type: ADD_HABITAT_CARD,
  payload: { card },
});

export const updateCard = (id, tag, index, data) => ({
  type: UPDATE_HABITAT_CARD,
  payload: {
    id,
    tag,
    index,
    data,
  },
});

export const deleteCard = (id, type) => ({
  type: DELETE_HABITAT_CARD,
  payload: { id, type },
});
