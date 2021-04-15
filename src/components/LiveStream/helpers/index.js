import { WebRTCAdaptor } from './webrtcAdaptor';
import { WebSocketAdaptor } from './websocketAdaptor';

import { wsMessages, MEDIASERVER_SOCKET_URL } from './constants';

const {
  INITIALIZED,
  START,
  TAKE_CANDIDATE,
  TAKE_CONFIGURATION,
  STOP,
  NOTIFICATION,
  ERROR,
  PLAY_FINISHED,
  PUBLISH_FINISHED,
  STREAM_IN_USE,
} = wsMessages;

let websocketConnection = null;

const webRTCMap = new Map();

const sendMessage = (channelId, message, ...props) => {
  const adapter = webRTCMap.get(channelId);
  if (!adapter) {
    console.warn('adapter is not longer on screen, ignoring message');
    webRTCMap.delete(channelId);
    return;
  }
  adapter[message](...props);
}

const sendStreamInUseMessage = () => {
  // eslint-disable-next-line
  for (const [stream, adapter] of webRTCMap.entries()) {
    adapter.callbackError(STREAM_IN_USE);
  }
}

const handleSocketCallback = (msg) => {
  const obj = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
  const { streamId } = obj;

  switch (obj.command) {
    case INITIALIZED: {
      // eslint-disable-next-line no-restricted-syntax, no-unused-vars
      for (const [stream, adapter] of webRTCMap.entries()) {
        if (!adapter.isInitialized) {
          adapter.init();
          adapter.callback('initialized');
        }
      }
      break;
    }
    case START: {
      sendMessage(streamId, 'startPublishing', streamId);
      break;
    }
    case TAKE_CANDIDATE: {
      const { label, candidate } = obj;
      sendMessage(streamId, 'takeCandidate', streamId, label, candidate);
      break;
    }
    case TAKE_CONFIGURATION: {
      const { sdp, type } = obj;
      sendMessage(streamId, 'takeConfiguration', streamId, sdp, type);
      break;
    }
    case STOP: {
      sendMessage(streamId, 'closePeerConnection', streamId);
      break;
    }
    case NOTIFICATION: {
      const { definition } = obj;
      sendMessage(streamId, 'callback', definition, obj);
      if ([PLAY_FINISHED, PUBLISH_FINISHED].includes(definition)) {
        sendMessage(streamId, 'closePeerConnection', streamId);
      }
      break;
    }
    case ERROR: {
      const { definition } = obj;
      if (definition === STREAM_IN_USE) {
        sendStreamInUseMessage();
      } else {
        sendMessage(streamId, 'callbackError', definition);
      }
      break;
    }
    default: {
      if (obj.command !== 'pong') {
        console.error(msg, 'message not handled by adapter');
      }
    }
  }
}

const handleCallbackError = (err) => {
  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [stream, adapter] of webRTCMap.entries()) {
    adapter.callbackError(err);
  }
}

const initializeSocketConnection = () => {
  websocketConnection = new WebSocketAdaptor({
    websocket_url: MEDIASERVER_SOCKET_URL,
    callback: handleSocketCallback,
    calbackError: handleCallbackError,
  });

  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [stream, adapter] of webRTCMap.entries()) {
    adapter.webSocketAdaptor = websocketConnection;
  }
}

if (typeof window !== 'undefined') {
  initializeSocketConnection();
}

export const removeWebRTCAdaptor = async (streamId) => {
  if (webRTCMap.has(streamId)) {
    const adaptor = webRTCMap.get(streamId);
    await adaptor.turnOffLocalSources();
    await adaptor.closePeerConnections();
    webRTCMap.delete(streamId);
  }
}

export const initWebRTCAdaptor = (streamId, videoContainer, mode, callback, callbackError) => {
  if (webRTCMap.has(streamId)) {
    const adaptor = webRTCMap.get(streamId);
    adaptor.closePeerConnections();
    webRTCMap.delete(streamId);
  }

  const adaptor = new WebRTCAdaptor({
    videoContainer,
    callback,
    debug: false,
    callbackError,
    isPlayMode: mode === 'viewer',
    webSocketAdaptor: websocketConnection,
    restartSocket: initializeSocketConnection,
  });
  webRTCMap.set(streamId, adaptor);

  if (websocketConnection.connected) {
    adaptor.init();
    adaptor.callback('initialized');
  }
  return adaptor;
};
