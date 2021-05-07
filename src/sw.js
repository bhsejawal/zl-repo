import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';

const publicPages = [
  '/', '/oranapark', '/orana', '/torontozoo', '/pmmc',
  '/sazoo', '/terms-and-conditions', '/privacy-policy',
  '/twitch',
];

// setup routing and precaching only for app pages - no need to do it on public pages
// eslint-disable-next-line no-restricted-globals
self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const client of clients) {
    const { pathname } = new URL(client.url);
    if (!publicPages.includes(pathname)) {
      setupRouting();
      setupPrecaching(getFiles());
    }
  }
});
