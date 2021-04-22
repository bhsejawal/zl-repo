// This is loaded before envVars on preact.config
// hence dotenv will be used to inject .env
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config()

module.exports = [
  { url: '/', title: 'Zoolife', segmentId: process.env.PREACT_APP_SEGMENT_ID },
  { url: '/oranapark', title: 'Zoolife - Orana Zoo', segmentId: process.env.PREACT_APP_SEGMENT_ID },
  { url: '/torontozoo', title: 'Zoolife - Toronto Zoo', segmentId: process.env.PREACT_APP_SEGMENT_ID },
  { url: '/pmmc', title: 'Zoolife - Pacific Marine Mammal Center', segmentId: process.env.PREACT_APP_SEGMENT_ID },
  { url: '/sazoo', title: 'Zoolife - San Antonio Zoo', segmentId: process.env.PREACT_APP_SEGMENT_ID },

  // this will prerender only loading indicator
  // we'll use this as fallback on s3
  { url: '/account', segmentId: process.env.PREACT_APP_SEGMENT_ID },
];
