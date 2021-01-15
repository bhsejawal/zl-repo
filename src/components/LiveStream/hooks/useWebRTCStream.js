import { useState, useEffect } from 'preact/hooks';
import { WebRTCAdaptor } from '../helpers/webrtcAdaptor';

let webRTCAdaptor;
//  TODO: This should probably be request by the front-end or be returned on the habitat config
const MEDIASERVER_SOCKET_URL = 'wss://brizi.video:5443/WebRTCAppEE/websocket';

export const streamStatuses = Object.freeze({
  CLOSED: 'closed',
  INITIALIZING: 'initializing',
  INITIALIZED: 'initialized',
  PLAYING: 'play_started',
  PLAY_FINISHED: 'play_finished',
  ERROR: 'error',
});

export const useWebRTCStream = (streamId, videoContainer) => {
  const [streamStatus, setStreamStatus] = useState(streamStatuses.CLOSED);
  const [isWebsocketConnected, setIsWebsocketConnected] = useState(false);

  useEffect(() => {
    if (
      streamId
      && videoContainer.current
      && !isWebsocketConnected
      && streamStatus === streamStatuses.CLOSED
    ) {
      setStreamStatus(streamStatuses.INITIALIZING);
      webRTCAdaptor = new WebRTCAdaptor({
        websocket_url: MEDIASERVER_SOCKET_URL,
        remoteVideoContainer: videoContainer.current,
        callback(info) {
          if (info === streamStatuses.INITIALIZED) {
            webRTCAdaptor.play(streamId);
            setStreamStatus(streamStatuses.PLAYING);
            setIsWebsocketConnected(true);
          }

          if ([streamStatuses.CLOSED, streamStatuses.PLAY_FINISHED].includes(info)) {
            setStreamStatus(streamStatuses.CLOSED);
          }
        },
        callbackError(error) {
          setStreamStatus(streamStatuses.ERROR);
          // some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
          console.error(`error callback: ${JSON.stringify(error)}`);
        },
      });
    }
    return () => {
      if (streamStatus === streamStatus.PLAYING && isWebsocketConnected) {
        webRTCAdaptor.stop(streamId)
      }
    };
  }, [streamId, videoContainer, streamStatus, isWebsocketConnected]);

  return streamStatus;
};
