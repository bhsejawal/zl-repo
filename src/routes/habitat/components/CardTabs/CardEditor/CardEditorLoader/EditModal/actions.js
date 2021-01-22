import {
  ADD_HABITAT_CARD,
  DELETE_HABITAT_CARD,
  UPDATE_HABITAT_CARD,
} from '../../../types';

export const addCard = (card) => ({
  type: ADD_HABITAT_CARD,
  payload: { card },
});

export const updateCard = (id, tag, data) => ({
  type: UPDATE_HABITAT_CARD,
  payload: { id, tag, data },
});

export const deleteCard = (id) => ({
  type: DELETE_HABITAT_CARD,
  payload: { id },
});
