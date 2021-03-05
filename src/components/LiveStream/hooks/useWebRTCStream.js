import { useState, useEffect, useRef } from 'preact/hooks';
import { initWebRTCAdaptor, removeWebRTCAdaptor } from '../helpers';
import { wsMessages } from '../helpers/constants';

const {
  CLOSED,
  INITIALIZING,
  INITIALIZED,
  PLAY_STARTED,
  PLAY_FINISHED,
  PUBLISH_FINISHED,
  ERROR,
} = wsMessages;

let webRTCAdaptor;

// eslint-disable-next-line import/prefer-default-export
export const useWebRTCStream = (streamId, videoContainer, logStatsFn) => {
  const [streamStatus, setStreamStatus] = useState(CLOSED);
  const [isWebsocketConnected, setIsWebsocketConnected] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(
      () => {
        if (streamStatus === PLAY_STARTED && logStatsFn) {
          logStatsFn(webRTCAdaptor.getStreamStats(streamId));
        }
      },
      30000,
    );
    return () => clearInterval(intervalRef.current);
  }, [streamId, logStatsFn, streamStatus])

  useEffect(() => {
    if (
      streamId
      && videoContainer.current
      && !isWebsocketConnected
      && streamStatus === CLOSED
    ) {
      setStreamStatus(INITIALIZING);
      webRTCAdaptor = initWebRTCAdaptor(streamId, videoContainer.current, (info) => {
        if (info === INITIALIZED) {
          webRTCAdaptor.play(streamId);
          webRTCAdaptor.enableStats(streamId);
          setStreamStatus(PLAY_STARTED);
          setIsWebsocketConnected(true);
        }

        if ([
          CLOSED,
          PLAY_FINISHED,
          PUBLISH_FINISHED,
        ].includes(info)) {
          setStreamStatus(CLOSED);
        }
      },
      (error) => {
        setStreamStatus(ERROR);
        // some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        console.error(`error callback: ${JSON.stringify(error)}`, streamId);
      });
    }
    return () => {
      if (isWebsocketConnected) {
        removeWebRTCAdaptor(streamId);
      }
    };
  }, [streamId, videoContainer, streamStatus, isWebsocketConnected]);

  return streamStatus;
};
