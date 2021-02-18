const initialState = {
  plans: [
    {
      planId: 1,
      planName: 'Day Pass',
      planPrice: '$4.99',
      planCurrency: 'cad',
      planType: '/visit',
      color: '#5260DD',
      benefits: ['24h Access'],
    },
    {
      planId: 2,
      planName: 'Monthly Pass',
      planPrice: '$9.99',
      planCurrency: 'cad',
      planType: '/month',
      color: '#CE5BB5',
      benefits: ['24h Auto-Renewing', 'Cancel Anytime'],
    },
    {
      planId: 3,
      planName: 'Annual Pass',
      planPrice: '$139.99',
      planCurrency: 'cad',
      planType: '/year',
      color: '#DC6128',
      amountOff: 33,
      benefits: ['Auto-Renewing', 'Cancel Anytime'],
    },
  ],
};

export default (state = initialState, { type }) => {
  switch (type) {
    default: {
      return state;
    }
  }
};
