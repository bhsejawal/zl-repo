import { pick } from 'lodash-es';
import { MEET } from './constants';
import {
  ADD_HABITAT_CARD,
  UPDATE_HABITAT_CARD,
  SET_HABITAT_CARDS,
  SET_HABITAT_TAB,
  DELETE_HABITAT_CARD,
} from './types';

const cardSort = ({ index: i1 }, { index: i2 }) => (i1 - i2);

const updateFamilyCards = (state, cards) => (
  state.activeTab === MEET
    ? cards.filter((card) => (card?.data?.name)).map(({ data }) => pick(data, ['name', 'img', 'dateOfBirth']))
    : state.familyCards
);

const initialState = {
  items: [],
  familyCards: [],
  activeTab: MEET,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_HABITAT_CARDS: {
      const { cards } = payload;
      const items = cards.sort(cardSort);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
      };
    }

    case ADD_HABITAT_CARD: {
      const { card } = payload;
      const items = [...state.items, card].sort(cardSort);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
      };
    }

    case UPDATE_HABITAT_CARD: {
      const {
        id,
        tag,
        index,
        data,
      } = payload;

      const items = state.items.map((card) => (
        // eslint-disable-next-line no-underscore-dangle
        card._id === id ? {
          ...card,
          tag,
          index,
          data,
        } : card
      )).sort(cardSort);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
      }
    }

    case DELETE_HABITAT_CARD: {
      const { id } = payload;
      const items = state.items.filter(({ _id }) => _id !== id);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
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
