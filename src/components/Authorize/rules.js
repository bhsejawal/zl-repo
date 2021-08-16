import store from '../../redux/store';

const canEditZoo = () => {
  const {
    user: { zooId: userZooId },
    habitat: { habitatInfo: { zoo: { _id: zooId } } },
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
  const { user: { subscription: { active, productId } } } = store.getState();
  return active || productId === 'FREEMIUM';
}

const notTrial = () => {
  const { user: { subscription: { productId } } } = store.getState();
  return productId && productId !== 'TRIAL';
}

const rules = {
  guest: {
    static: ['checkout:plans', 'signup:view', 'login:view'],
  },
  user: {
    static: ['profile:edit', 'redirect:view', 'welcome:view', 'checkout:plans', 'map:view', 'favorite:edit', 'schedule:view'],
    dynamic: {
      'habitat:view': isSubscriptionActive,
      'subscription:cancel': isSubscriptionActive,
      'subscription:edit': notTrial,
    },
  },
  vip: {
    static: ['profile:edit', 'favorite:edit', 'habitat:view', 'map:view', 'redirect:view', 'schedule:view'],
  },
  partner: {
    static: ['habitat:view', 'map:view', 'profile:edit', 'favorite:edit', 'redirect:view', 'schedule:view'],
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
      "habitat:edit-album-media": canEditZoo,
      // TODO: do we need to separate buttons
      // or one permission is enough for all 3 items
      "habitat:edit-stream": canEditZoo,
    },
  },
  host: {
    static: ['habitat:view', 'map:view', 'profile:edit', 'favorite:edit', 'redirect:view', 'schedule:view'],
    dynamic: { "habitat:broadcast": canEditHabitat },
  },
};

export default rules;
