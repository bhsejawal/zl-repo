const initialState = {
  plans: [
    {
      planId: 1,
      planName: 'Day Pass',
      planPrice: '$4.99',
      planType: '/visit',
      color: '#5260DD',
      benefits: ['Placeholder point', 'Placeholder point', 'Placeholder point', 'Placeholder point'],
    },
    {
      planId: 2,
      planName: 'Monthly Membership',
      planPrice: '$9.99',
      planType: '/month',
      color: '#BF3D3F',
      benefits: ['Placeholder point', 'Placeholder point', 'Placeholder point', 'Placeholder point', 'Placeholder point'],
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
