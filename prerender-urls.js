module.exports = [
  { url: '/', title: 'Zoolife' },
  { url: '/oranapark', title: 'Zoolife - Orana Zoo' },
  { url: '/torontozoo', title: 'Zoolife - Toronto Zoo' },
  { url: '/pmmc', title: 'Zoolife - Pacific Marine Mammal Center' },
  { url: '/sazoo', title: 'Zoolife - San Antonio Zoo' },

  // this will prerender only loading indicator
  // we'll use this as fallback on s3
  { url: '/account' },
];
