export const wsMessages = Object.freeze({
  INITIALIZED: 'initialized',
  START: 'start',
  TAKE_CANDIDATE: 'takeCandidate',
  TAKE_CONFIGURATION: 'takeConfiguration',
  STOP: 'stop',
  NOTIFICATION: 'notification',
  ERROR: 'error',
  CLOSED: 'closed',
  INITIALIZING: 'initializing',
  PLAY_STARTED: 'play_started',
  PLAY_FINISHED: 'play_finished',
  PUBLISH_FINISHED: 'publish_finished',
});

export const MEDIASERVER_SOCKET_URL = process.env.PREACT_APP_MEDIASERVER_SOCKET_URL;
