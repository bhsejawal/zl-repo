import {
  CLOSE_MODAL_CARDS,
  OPEN_MODAL_CARDS,
  MOBILE_CARD_INDEX_NEXT,
  MOBILE_CARD_INDEX_PREV,
  MOBILE_CARD_INDEX_RESET,
  OPEN_MODAL_CALENDAR,
  CLOSE_MODAL_CALENDAR,
} from './types';

const initialState = {
  activeMobileCardsTab: undefined,
  // when this value is -1 or habitat.cards.length
  // modal effect will load previous or next card bucket
  activeCardIndex: 0,
  calendarCardOpen: false,
};

export default (state = initialState, { type, payload = {} } = {}) => {
  switch (type) {
    case OPEN_MODAL_CARDS: {
      const { activeMobileCardsTab } = payload;
      return {
        ...state,
        activeMobileCardsTab,
        activeCardIndex: 0,
      };
    }

    case CLOSE_MODAL_CARDS: {
      return { ...state, activeMobileCardsTab: undefined };
    }

    case MOBILE_CARD_INDEX_NEXT: {
      const { cardsLen } = payload;
      return state.activeCardIndex < cardsLen
        ? { ...state, activeCardIndex: state.activeCardIndex + 1 }
        : state;
    }

    case MOBILE_CARD_INDEX_PREV: {
      return { ...state, activeCardIndex: state.activeCardIndex - 1 };
    }

    case MOBILE_CARD_INDEX_RESET: {
      return { ...state, activeCardIndex: 0 };
    }

    case OPEN_MODAL_CALENDAR: {
      return { ...state, calendarCardOpen: true };
    }

    case CLOSE_MODAL_CALENDAR: {
      return { ...state, calendarCardOpen: false };
    }

    default: {
      return state;
    }
  }
};
