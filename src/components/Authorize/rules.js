import store from '../../redux/store';

const canEditZoo = () => {
  const {
    user: { zooId: userZooId },
    habitat: { habitatInfo: { zooId } },
  } = store.getState();

  return userZooId === zooId;
}

const canEditHabitat = () => {
  const {
    user: { habitats },
    habitat: { habitatInfo: { _id: habitatId } },
  } = store.getState();

  return habitats.includes(habitatId);
}

const isSubscriptionActive = () => {
  const { user: { subscription: { active } } } = store.getState();
  return active;
}

const rules = {
  guest: {
    static: ['checkout:plans'],
  },
  viewer: {
    static: ['profile:edit', 'favorite:edit'],
    dynamic: {
      'habitat:view': isSubscriptionActive,
      'map:view': isSubscriptionActive,
      'checkout:plans': () => !(isSubscriptionActive()),
    },
  },
  partner: {
    static: ['habitat:view', 'map:view', 'profile:edit', 'favorite:edit'],
    dynamic: {
      "zoo:edit-timezone": canEditZoo,
      "zoo:edit-location": canEditZoo,
      "habitat:edit-text": canEditZoo,
      "habitat:edit-media": canEditZoo,
      "habitat:edit-cards": canEditZoo,
      "habitat:edit-quiz": canEditZoo,
      "habitat:edit-album": canEditZoo,
      "habitat:edit-schedule": canEditZoo,
      "habitat:broadcast": canEditZoo,
      // TODO: do we need to separate buttons
      // or one permission is enough for all 3 items
      "habitat:edit-stream": canEditZoo,
    },
  },
  host: {
    static: ['habitat:view', 'map:view', 'profile:edit', 'favorite:edit'],
    dynamic: {
      "habitat:broadcast": canEditHabitat,
      "habitat:edit-stream": canEditHabitat,
    },
  },
};

export default rules;
