import { set } from 'lodash-es';
import {
  SET_MAP_DATA,
  SELECT_HABITAT,
  UPDATE_HABITAT_DATA,
  TOGGLE_MAP_MODAL,
  SELECT_EDIT_HABITAT,
  UPDATE_HABITAT_LIST,
} from './types';

const initialState = {
  habitats: [],
  activeHabitat: null,
  showMapModal: false,
  editHabitat: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MAP_DATA: {
      const { habitats } = payload;
      return { ...state, habitats };
    }

    case SELECT_HABITAT: {
      const { habitatId } = payload;
      return {
        ...state,
        activeHabitat: state.habitats
          .find(({ _id }) => _id === habitatId),
      };
    }

    case SELECT_EDIT_HABITAT: {
      const { habitatId } = payload;
      return {
        ...state,
        editHabitat: habitatId ? state.habitats
          .find(({ _id }) => _id === habitatId) : {},
      };
    }

    case UPDATE_HABITAT_DATA: {
      const { field, value } = payload;
      const newHabitatData = { ... state.editHabitat };
      set(newHabitatData, field, value);
      return {
        ...state,
        editHabitat: newHabitatData,
      }
    }

    case TOGGLE_MAP_MODAL: {
      return {
        ...state,
        showMapModal: !state.showMapModal,
      }
    }

    case UPDATE_HABITAT_LIST: {
      const newHabitat = state.editHabitat;

      const newHabitatList = state.habitats.map((habitat) => (
        habitat._id === newHabitat._id ? newHabitat : habitat
      ));

      const newActiveHabitat = state.activeHabitat._id === newHabitat._id
        ? newHabitat : state.activeHabitat;

      return {
        ...state,
        habitats: newHabitatList,
        activeHabitat: newActiveHabitat,
        editHabitat: {},
      }
    }
    default: {
      return state;
    }
  }
};
