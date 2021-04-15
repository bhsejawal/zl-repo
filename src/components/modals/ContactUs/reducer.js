import { OPEN_CONTACT_US_MODAL, CLOSE_CONTACT_US_MODAL } from "./types";

const initialState = { isOpen: false };

export default (state = initialState, { type }) => {
  if (type === OPEN_CONTACT_US_MODAL) {
    return { ...state, isOpen: true };
  }

  if (type === CLOSE_CONTACT_US_MODAL) {
    return { ...state, isOpen: false };
  }

  return state;
};
