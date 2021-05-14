/* global __webpack_public_path__ */

import 'preact-cli/lib/lib/entry';

if (process.env.NODE_ENV === 'production') {
  console.log('production')
}

navigator.serviceWorker.register(
  // eslint-disable-next-line camelcase
  __webpack_public_path__ + (process.env.ES_BUILD ? 'sw-esm.js' : 'sw.js'),
  { scope: '/' },
);
