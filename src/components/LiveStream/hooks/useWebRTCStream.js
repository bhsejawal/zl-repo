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
  OFFLINE,
  STREAM_IN_USE,
  PUBLISH_TIMEOUT,
} = wsMessages;

let webRTCAdaptor;

// eslint-disable-next-line import/prefer-default-export
export const useWebRTCStream = (streamId, isStreamOn, videoContainer, mode, logStatsFn) => {
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

  const startPlaying = useCallback(() => {
    webRTCAdaptor.play(streamId);
    webRTCAdaptor.enableStats(streamId);
  }, [streamId])

  const startPublishing = useCallback(() => {
    if (streamStatus === PLAY_STARTED) {
      webRTCAdaptor.publish(streamId);
    }
  }, [streamStatus, streamId]);

  const stopPublishing = useCallback(() => {
    if (streamStatus === PUBLISH_STARTED) {
      webRTCAdaptor.stop(streamId);
    }
  }, [streamStatus, streamId]);

  const stopPlaying = useCallback(() => {
    if (streamStatus === PLAY_STARTED) {
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
    const onPlayHandler = () => {
      setStreamStatus(PLAY_STARTED);
    }
    const htmlVideoContainer = videoContainer?.current;

    if (htmlVideoContainer) {
      htmlVideoContainer.addEventListener('play', onPlayHandler);
    }

    return () => {
      if (htmlVideoContainer) {
        htmlVideoContainer.removeEventListener('play', onPlayHandler);
      }
    }
  }, [videoContainer, streamStatus]);

  const initializeAdapter = useCallback(() => {
    setStreamStatus(INITIALIZING);
    webRTCAdaptor = initWebRTCAdaptor(
      streamId,
      videoContainer.current,
      mode,
      // eslint-disable-next-line prefer-arrow-callback
      function callback(info, data) {
        if (info === INITIALIZED) {
          setStreamStatus(INITIALIZED);
          setIsWebsocketConnected(true);
        }

        if (info === 'available_devices') {
          setAvailableDevices(data);
        }

        if (info === PUBLISH_STARTED) {
          setStreamStatus(PUBLISH_STARTED);
        }

        if (info === PUBLISH_TIMEOUT) {
          setStreamStatus(PUBLISH_TIMEOUT);
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
        if (error === STREAM_IN_USE && mode !== 'viewer') {
          setStreamStatus(STREAM_IN_USE);
          return;
        }

        if (error === STREAM_IN_USE && mode === 'viewer') {
          return;
        }

        const currentError = error === OFFLINE && !isStreamOn ? CLOSED : ERROR;
        setStreamStatus(currentError);
        // some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        console.error(`error callback: ${JSON.stringify(error)}`, streamId);
      },
    );
  }, [streamId, videoContainer, mode])

  useEffect(() => {
    if (
      streamId
      && videoContainer.current
      && !isWebsocketConnected
      && streamStatus === CLOSED
      && !webRTCAdaptor
    ) {
      initializeAdapter();
    }
  }, [streamId, videoContainer, isWebsocketConnected, streamStatus, isStreamOn]);

  return {
    streamStatus,
    availableDevices,
    startPublishing,
    stopPublishing,
    startPlaying,
    stopPlaying,
    switchAudioInput,
    switchVideoInput,
    removeWebRTCAdaptor,
    initializeAdapter,
  };
};
