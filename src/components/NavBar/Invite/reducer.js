import { CLOSE_INVITE_MODAL, OPEN_INVITE_MODAL } from "./types";

const initialState = { isOpen: false };

export default (state = initialState, { type }) => {
  if (type === OPEN_INVITE_MODAL) {
    return { ...state, isOpen: true };
  }

  if (type === CLOSE_INVITE_MODAL) {
    return { ...state, isOpen: false };
  }

  return state;
};
