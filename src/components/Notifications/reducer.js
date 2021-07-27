import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './types';

// Testing data
// const testingData = [
//   {
//     id: Math.random(),
//     type: 'toast',
//     text: 'INIT TOAST TEST',
//     timeout: 3000,
//   },
//   {
//     id: Math.random(),
//     type: 'liveTalkToast',
//     timeout: 3000,
//     schedule: {
//       _id: '60fa150e66eff76ffe81ad85',
//       habitat: {
//         _id: '60fa150e66eff76ffe81ad85',
//         profileImage: 'https://zoolife.brizi.tech/assets/destination/Siamang-1617211420219-1619642054877.png'
//       },
//       zoo: 'Pacific Marine Mammal Center',
//       title: 'Notification sys Test Event',
//       description: 'Some description and lets make it long to see how it will render on the card'
//     },
//     zooSlug: 'orana-zoo',
//     habitatSlug: 'brizi-cam28-sami-108',
//   },
// ];

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_NOTIFICATION: {
      return [...state, {...payload}];
    }

    case REMOVE_NOTIFICATION: {
      const { id: notificationId } = payload;
      return state.filter(({ id }) => id !== notificationId);
    }

    default: {
      return state;
    }
  }
};
