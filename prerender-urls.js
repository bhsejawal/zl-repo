// This is loaded before envVars on preact.config
// hence dotenv will be used to inject .env
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config()

module.exports = [
  {
    url: '/',
    title: 'Zoolife - The world\'s first digital zoo.',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/twitch',
    title: 'Zoolife - The world\'s first digital zoo.',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/oranapark',
    title: 'Zoolife - The world\'s first digital zoo. - Orana Wildlife Park',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/orana',
    title: 'Zoolife - The world\'s first digital zoo. - Orana Wildlife Park',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/torontozoo',
    title: 'Zoolife - The world\'s first digital zoo. - Toronto Zoo',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/pmmc',
    title: 'Zoolife - The world\'s first digital zoo. - Pacific Marine Mammal Center',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/sazoo',
    title: 'Zoolife - The world\'s first digital zoo. - San Antonio Zoo',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/terms-and-conditions',
    title: 'Terms and Conditions',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
  {
    url: '/privacy-policy',
    title: 'Privacy Policy',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },

  // this will prerender only loading indicator
  // we'll use this as fallback on s3
  {
    url: '/account',
    segmentId: process.env.PREACT_APP_SEGMENT_ID,
    optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
    gaId: process.env.PREACT_APP_GA_APPID,
  },
];
