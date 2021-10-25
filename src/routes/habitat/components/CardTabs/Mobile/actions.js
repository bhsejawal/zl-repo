import {
  CLOSE_MODAL_CALENDAR,
  CLOSE_MODAL_CARDS,
  CLOSE_MODAL_QUESTIONS_AND_ANSWERS,
  MOBILE_CARD_INDEX_NEXT,
  MOBILE_CARD_INDEX_PREV,
  MOBILE_CARD_INDEX_RESET,
  OPEN_MODAL_CALENDAR,
  OPEN_MODAL_QUESTIONS_AND_ANSWERS,
  OPEN_MODAL_CARDS,
  OPEN_MODAL_SCHEDULES,
  CLOSE_MODAL_SCHEDULES,
  OPEN_MODAL_ALBUM,
  CLOSE_MODAL_ALBUM,
} from './types';

export const closeModalCards = () => ({ type: CLOSE_MODAL_CARDS });
export const openModalCards = (activeMobileCardsTab) => ({
  type: OPEN_MODAL_CARDS,
  payload: { activeMobileCardsTab },
});

export const nextCard = (cardsLen) => ({
  type: MOBILE_CARD_INDEX_NEXT,
  payload: { cardsLen },
});

export const prevCard = () => ({ type: MOBILE_CARD_INDEX_PREV });

export const resetCardInd = () => ({ type: MOBILE_CARD_INDEX_RESET });

export const closeModalCalendar = () => ({ type: CLOSE_MODAL_CALENDAR });
export const openModalCalendar = () => ({ type: OPEN_MODAL_CALENDAR });

export const closeModalQuestions = () => ({ type: CLOSE_MODAL_QUESTIONS_AND_ANSWERS});
export const openModalQuestions = () => ({ type: OPEN_MODAL_QUESTIONS_AND_ANSWERS });

export const closeModalSchedules = () => ({ type: CLOSE_MODAL_SCHEDULES });
export const openModalSchedules = () => ({ type: OPEN_MODAL_SCHEDULES });

export const closeModalAlbum = () => ({ type: CLOSE_MODAL_ALBUM });
export const openModalAlbum = () => ({ type: OPEN_MODAL_ALBUM });
