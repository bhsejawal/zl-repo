import { CLOSE_TERMS_MODAL, OPEN_TERMS_MODAL } from "./types";

const initialState = { isOpen: false };

export default (state = initialState, { type, payload = {} }) => {
  if (type === OPEN_TERMS_MODAL) {
    const { isCloseDisabled } = payload;
    return {
      ...state,
      isOpen: true,
      isCloseDisabled,
    };
  }

  if (type === CLOSE_TERMS_MODAL) {
    return {
      ...state,
      isOpen: false,
    };
  }

  return state;
};
