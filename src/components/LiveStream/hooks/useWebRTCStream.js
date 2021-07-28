import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'preact/hooks';
import {
  initWebRTCAdaptor,
  removeWebRTCAdaptor,
  play,
  enableStats,
  getStreamStats,
  publish,
  stop,
  switchAudioInputSource,
  switchVideoCameraCapture,
} from '../helpers';

import { iOSDevice } from '../../../helpers';

import { wsMessages } from '../helpers/constants';

const {
  CLOSED,
  INITIALIZING,
  INITIALIZED,
  PLAY_STARTED,
  PLAY_PAUSED,
  PLAY_FINISHED,
  PUBLISH_STARTED,
  PUBLISH_FINISHED,
  ERROR,
  OFFLINE,
  STREAM_IN_USE,
  PUBLISH_TIMEOUT,
  LOADING,
} = wsMessages;

let isInitializing = false;

// eslint-disable-next-line import/prefer-default-export
export const useWebRTCStream = (streamId, isStreamOn, videoContainer, mode, logStatsFn) => {
  const [streamStatus, setStreamStatus] = useState(CLOSED);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(
      () => {
        if (streamStatus === PLAY_STARTED && logStatsFn && mode === 'viewer') {
          logStatsFn(getStreamStats(streamId));
        }
      },
      30000,
    );
    return () => clearInterval(intervalRef.current);
  }, [streamId, logStatsFn, streamStatus, mode])

  const startPlaying = useCallback(() => {
    play(streamId);
    enableStats(streamId);
  }, [streamId])

  const startPublishing = useCallback(() => {
    if (streamStatus === PLAY_STARTED) {
      publish(streamId);
    }
  }, [streamStatus, streamId]);

  const stopPublishing = useCallback(() => {
    if (streamStatus === PUBLISH_STARTED) {
      stop(streamId);
    }
  }, [streamStatus, streamId]);

  const stopPlaying = useCallback(() => {
    stop(streamId);
    setStreamStatus(CLOSED);
  }, [streamId]);

  const pausePlaying = useCallback(() => {
    if (streamStatus !== PLAY_PAUSED) {
      setStreamStatus(PLAY_PAUSED);
      stop(streamId);
    } else {
      setStreamStatus(LOADING);
      play(streamId);

      // This is required if the video was stopped by suspense api
      // The browser would not allow any play if its not from a user interaction
      if (iOSDevice()) {
        videoContainer.current.play();
      }
    }
  }, [streamId, streamStatus, videoContainer])

  const switchAudioInput = useCallback(
    (deviceId) => switchAudioInputSource(streamId, deviceId), [streamId],
  );

  const switchVideoInput = useCallback(
    (deviceId) => switchVideoCameraCapture(streamId, deviceId), [streamId],
  );

  useEffect(() => {
    const onPlayHandler = () => {
      // Play handler will trigger again when users navigate through
      // the carousel, if someone is broadcasting, the container would reset
      if (streamStatus !== PUBLISH_STARTED) {
        setStreamStatus(PLAY_STARTED);
      }
    }

    const onSuspendeHandler = () => {
      // the suspense handler also activates when a video plays
      // the check bellow will avoid stopping the stream after
      // the user manually starts the video
      if (![LOADING, PLAY_STARTED].includes(streamStatus)) {
        setStreamStatus(PLAY_PAUSED);
        stop(streamId);
      }
    }

    const { current: htmlVideoContainer } = videoContainer;

    if (htmlVideoContainer) {
      htmlVideoContainer.addEventListener('play', onPlayHandler);
      htmlVideoContainer.addEventListener('suspend', onSuspendeHandler);
    }

    return () => {
      if (htmlVideoContainer) {
        htmlVideoContainer.removeEventListener('play', onPlayHandler);
        htmlVideoContainer.removeEventListener('suspend', onSuspendeHandler);
      }
    }
  }, [videoContainer, streamStatus, streamId]);

  const initializeAdapter = useCallback(() => {
    setStreamStatus(INITIALIZING);
    initWebRTCAdaptor(
      streamId,
      videoContainer.current,
      mode,
      // eslint-disable-next-line prefer-arrow-callback
      function callback(info, data) {
        if (info === INITIALIZED) {
          setStreamStatus(INITIALIZED);
          setIsInitialized(true);
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
          PUBLISH_FINISHED,
        ].includes(info)) {
          setStreamStatus(CLOSED);
        }

        if (info === PLAY_FINISHED && !streamStatus === PLAY_PAUSED) {
          if (streamStatus === PLAY_PAUSED) {
            setStreamStatus(CLOSED);
          }
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
      && !isInitialized
      && streamStatus === CLOSED
      && !isInitializing
      && isStreamOn
    ) {
      isInitializing = true;
      initializeAdapter();
    }
  }, [streamId, videoContainer, isInitialized, streamStatus, isStreamOn, initializeAdapter]);

  useEffect(() => () => {
    if (streamStatus === PLAY_STARTED && streamId) {
      stop(streamId);
    }
  }, [])

  return {
    streamStatus,
    availableDevices,
    startPublishing,
    stopPublishing,
    startPlaying,
    stopPlaying,
    pausePlaying,
    switchAudioInput,
    switchVideoInput,
    removeWebRTCAdaptor,
    initializeAdapter,
  };
};
