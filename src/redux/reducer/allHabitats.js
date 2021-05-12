import { SET_HABITATS, UNSET_HABITATS, UPDATE_HABITAT } from '../types';

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_HABITATS: {
      const { habitats } = payload;
      return habitats;
    }

    case UNSET_HABITATS: {
      return initialState;
    }

    case UPDATE_HABITAT: {
      const { habitatId, data } = payload;
      return state.map((habitat) => (
        habitat._id === habitatId
          ? { ...habitat, ...data }
          : habitat
      ));
    }

    default: {
      return state;
    }
  }
};
