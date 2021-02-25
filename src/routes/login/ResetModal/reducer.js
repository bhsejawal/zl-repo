import {
  SHOW_PASSWORD_RESET_MODAL,
  ENABLE_PASSWORD_RESET_BUTTON,
  INVALID_TOKEN,
  TOKEN,
} from './types';

const initialState = {
  showModal: false,
  submitEnabled: true,
  token: undefined,
  invalidToken: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_PASSWORD_RESET_MODAL: {
      const { showModal } = payload;
      return { ...state, showModal };
    }
    case ENABLE_PASSWORD_RESET_BUTTON: {
      const { submitEnabled } = payload;
      return { ...state, submitEnabled };
    }
    case INVALID_TOKEN: {
      const { invalidToken } = payload;
      return { ...state, invalidToken };
    }
    case TOKEN: {
      const { token } = payload;
      return { ...state, token };
    }
    default: {
      return state;
    }
  }
};
