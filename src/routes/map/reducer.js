import { set } from 'lodash-es';
import { UPDATE_HABITAT } from '../../redux/types';

import {
  SELECT_HABITAT,
  UPDATE_HABITAT_DATA,
  TOGGLE_MAP_MODAL,
  SET_EDIT_HABITAT,
} from './types';

const initialState = {
  activeHabitatId: null,
  showMapModal: false,
  editHabitat: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECT_HABITAT: {
      const { habitatId: activeHabitatId } = payload;
      return { ...state, activeHabitatId };
    }

    case SET_EDIT_HABITAT: {
      const { habitat } = payload;
      return { ...state, editHabitat: { ...habitat } };
    }

    case UPDATE_HABITAT_DATA: {
      const { field, value } = payload;
      const editHabitat = set({ ... state.editHabitat }, field, value);
      return { ...state, editHabitat };
    }

    case TOGGLE_MAP_MODAL: {
      return {
        ...state,
        showMapModal: !state.showMapModal,
      }
    }

    case UPDATE_HABITAT: {
      return {
        ...state,
        editHabitat: initialState.editHabitat,
      };
    }

    default: {
      return state;
    }
  }
};
