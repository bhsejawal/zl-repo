module.exports = [
  { url: '/', title: 'Zoolife' },
  { url: '/orana-zoo', title: 'Zoolife - Orana Zoo' },
  { url: '/toronto-zoo', title: 'Zoolife - Toronto Zoo' },
  { url: '/pacific-marine-mammal-center', title: 'Zoolife - Pacific Marine Mammal Center' },
  { url: '/san-antonio-zoo', title: 'Zoolife - San Antonio Zoo' },

  // this will prerender only loading indicator
  // we'll use this as fallback on s3
  { url: '/account' },
];
