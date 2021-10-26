import {
  CLOSE_MODAL_CARDS,
  OPEN_MODAL_CARDS,
  MOBILE_CARD_INDEX_NEXT,
  MOBILE_CARD_INDEX_PREV,
  MOBILE_CARD_INDEX_RESET,
  OPEN_MODAL_CALENDAR,
  CLOSE_MODAL_CALENDAR,
  OPEN_MODAL_QUESTIONS_AND_ANSWERS,
  CLOSE_MODAL_QUESTIONS_AND_ANSWERS,
  OPEN_MODAL_SCHEDULES,
  CLOSE_MODAL_SCHEDULES,
  OPEN_MODAL_ALBUM,
  CLOSE_MODAL_ALBUM,
} from './types';

const initialState = {
  activeMobileCardsTab: undefined,
  // when this value is -1 or habitat.cards.length
  // modal effect will load previous or next card bucket
  activeCardIndex: 0,
  calendarCardOpen: false,
  questionsCardOpen: false,
  schedulesCardOpen: false,
  albumCardOpen: false,
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

    case OPEN_MODAL_QUESTIONS_AND_ANSWERS: {
      return { ...state, questionsCardOpen: true };
    }

    case CLOSE_MODAL_QUESTIONS_AND_ANSWERS: {
      return { ...state, questionsCardOpen: false };
    }

    case OPEN_MODAL_SCHEDULES: {
      return { ...state, schedulesCardOpen: true };
    }

    case CLOSE_MODAL_SCHEDULES: {
      return { ...state, schedulesCardOpen: false };
    }

    case OPEN_MODAL_ALBUM: {
      return { ...state, albumCardOpen: true };
    }

    case CLOSE_MODAL_ALBUM: {
      return { ...state, albumCardOpen: false };
    }

    default: {
      return state;
    }
  }
};
