import { MEET } from './constants';
import {
  ADD_HABITAT_CARD,
  UPDATE_HABITAT_CARD,
  SET_HABITAT_CARDS,
  SET_HABITAT_TAB,
  DELETE_HABITAT_CARD,
} from './types';

const initialState = {
  items: [],
  activeTab: MEET,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_HABITAT_CARDS: {
      const { cards: items } = payload;
      return { ...state, items };
    }

    case ADD_HABITAT_CARD: {
      const { card } = payload;
      return {
        ...state,
        items: [...state.items, card],
      };
    }

    case UPDATE_HABITAT_CARD: {
      const { id, tag, data } = payload;
      return {
        ...state,
        items: state.items.map((card) => (
          // eslint-disable-next-line no-underscore-dangle
          card._id === id
            ? { ...card, tag, data }
            : card
        )),
      }
    }

    case DELETE_HABITAT_CARD: {
      const { id } = payload;
      return {
        ...state,
        items: state.items.filter(({ _id }) => _id !== id),
      };
    }

    case SET_HABITAT_TAB: {
      const { activeTab } = payload;
      return { ...state, activeTab };
    }

    default: {
      return state;
    }
  }
};
