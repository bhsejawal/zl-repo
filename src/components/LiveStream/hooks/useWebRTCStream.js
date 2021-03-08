import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'preact/hooks';
import { initWebRTCAdaptor, removeWebRTCAdaptor } from '../helpers';
import { wsMessages } from '../helpers/constants';

const {
  CLOSED,
  INITIALIZING,
  INITIALIZED,
  PLAY_STARTED,
  PLAY_FINISHED,
  PUBLISH_STARTED,
  PUBLISH_FINISHED,
  ERROR,
} = wsMessages;

let webRTCAdaptor;

// eslint-disable-next-line import/prefer-default-export
export const useWebRTCStream = (streamId, videoContainer, mode, logStatsFn) => {
  const [streamStatus, setStreamStatus] = useState(CLOSED);
  const [isWebsocketConnected, setIsWebsocketConnected] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(
      () => {
        if (streamStatus === PLAY_STARTED && logStatsFn && mode === 'viewer') {
          logStatsFn(webRTCAdaptor.getStreamStats(streamId));
        }
      },
      30000,
    );
    return () => clearInterval(intervalRef.current);
  }, [streamId, logStatsFn, streamStatus, mode])

  const startPublishing = useCallback(() => {
    if (streamStatus === INITIALIZED) {
      webRTCAdaptor.publish(streamId);
    }
  }, [streamStatus, streamId]);

  const stopPublishing = useCallback(() => {
    if (streamStatus === PUBLISH_STARTED) {
      webRTCAdaptor.stop(streamId);
    }
  }, [streamStatus, streamId]);

  const switchAudioInput = useCallback(
    (deviceId) => webRTCAdaptor.switchAudioInputSource(streamId, deviceId), [streamId],
  );

  const switchVideoInput = useCallback(
    (deviceId) => webRTCAdaptor.switchVideoCameraCapture(streamId, deviceId), [streamId],
  );

  useEffect(() => {
    if (
      streamId
      && videoContainer.current
      && !isWebsocketConnected
      && streamStatus === CLOSED
    ) {
      setStreamStatus(INITIALIZING);
      webRTCAdaptor = initWebRTCAdaptor(
        streamId,
        videoContainer.current,
        mode,
        function callback(info, data) {
          if (info === INITIALIZED) {
            if (mode === 'viewer') {
              this.play(streamId);
              this.enableStats(streamId);
              setStreamStatus(PLAY_STARTED);
            } else {
              setStreamStatus(INITIALIZED);
            }
            setIsWebsocketConnected(true);
          }

          if (info === 'available_devices') {
            setAvailableDevices(data);
          }

          if (info === PUBLISH_STARTED) {
            setStreamStatus(PUBLISH_STARTED);
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
        },
      );
    }
  }, [streamId, videoContainer, isWebsocketConnected, mode, streamStatus]);

  return {
    streamStatus,
    availableDevices,
    startPublishing,
    stopPublishing,
    switchAudioInput,
    switchVideoInput,
    removeWebRTCAdaptor,
  };
};
