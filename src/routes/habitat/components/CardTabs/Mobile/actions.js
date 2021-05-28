import {
  CLOSE_MODAL_CARDS,
  MOBILE_CARD_INDEX_NEXT,
  MOBILE_CARD_INDEX_PREV,
  MOBILE_CARD_INDEX_RESET,
  OPEN_MODAL_CARDS,
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
