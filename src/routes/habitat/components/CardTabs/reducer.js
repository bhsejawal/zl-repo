import { pick } from 'lodash-es';
import { MEET, QUIZ_CARD_TYPE} from './constants';
import {
  ADD_HABITAT_CARD,
  UPDATE_HABITAT_CARD,
  SET_HABITAT_CARDS,
  SET_HABITAT_TAB,
  DELETE_HABITAT_CARD,
  SET_CARDS_LOADING,
  SET_CARDS_SHORTCUT,
} from './types';
import {
  CLOSE_MODAL_CARDS,
  OPEN_MODAL_CARDS,
  MOBILE_CARD_INDEX_NEXT,
  MOBILE_CARD_INDEX_PREV,
  MOBILE_CARD_INDEX_RESET,
} from './Mobile/types';

import mobile from './Mobile/reducer';

const cardSort = ({ index: i1 }, { index: i2 }) => (i1 - i2);

const updateFamilyCards = (state, cards) => (
  state.activeTab === MEET
    ? cards.filter((card) => (card?.data?.name)).map(({ data }) => pick(data, ['name', 'img', 'dateOfBirth']))
    : state.familyCards
);

const initialState = {
  loading: false,
  items: [],
  familyCards: [],
  activeTab: MEET,
  canCreateQuizCard: false,
  activeShortcut: null,
  mobile: mobile(),
};

export default (state = initialState, action = {}) => {
  const { type, payload = {} } = action;

  switch (type) {
    case SET_HABITAT_CARDS: {
      const { cards } = payload;
      const items = cards.sort(cardSort);
      const canCreateQuizCard = !cards.some(({ type }) => type === QUIZ_CARD_TYPE);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
        canCreateQuizCard,
      };
    }

    case ADD_HABITAT_CARD: {
      const { card } = payload;
      const { type } = card;
      const items = [...state.items, card].sort(cardSort);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
        canCreateQuizCard: state.canCreateQuizCard && !type === QUIZ_CARD_TYPE,
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
      const { id, type } = payload;
      const items = state.items.filter(({ _id }) => _id !== id);

      return {
        ...state,
        items,
        familyCards: updateFamilyCards(state, items),
        canCreateQuizCard: type === QUIZ_CARD_TYPE || state.canCreateQuizCard,
      };
    }

    case SET_HABITAT_TAB: {
      const { activeTab } = payload;
      return { ...state, activeTab };
    }

    case SET_CARDS_LOADING: {
      const { loading } = payload;
      return { ...state, loading };
    }

    case SET_CARDS_SHORTCUT: {
      const { activeShortcut } = payload;
      return { ...state, activeShortcut };
    }

    case MOBILE_CARD_INDEX_NEXT:
    case MOBILE_CARD_INDEX_PREV:
    case MOBILE_CARD_INDEX_RESET:
    case OPEN_MODAL_CARDS:
    case CLOSE_MODAL_CARDS: {
      return { ...state, mobile: mobile(state.mobile, action) };
    }

    default: {
      return state;
    }
  }
};
