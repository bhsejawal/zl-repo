import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

setupRouting();
setupPrecaching([
  ...getFiles(),
  { url: 'https://zoolife.tv/assets/zoolife_onboarding.mp4', revision: null },
]);

registerRoute(
  'https://zoolife.tv/assets/zoolife_onboarding.mp4',
  new CacheFirst(),
);
