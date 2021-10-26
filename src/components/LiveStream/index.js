import { h } from 'preact';
import {
  useRef,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { GlobalsContext } from 'Shared/context';
import { hasPermission } from 'Components/Authorize';
import TimeBar from 'Components/TimeBar';
import VideoControls from 'Components/VideoControls';
import ContentExplorer from 'Components/ContentExplorer';
import { post, buildURL } from 'Shared/fetch';

import Fallback from './Fallback';

import StreamInteractiveArea from './StreamInteractiveArea';
import AdminButton from './AdminButton';
import LiveStreamContext from './LiveStreamContext';
import MobileControls from './MobileControls.js';

import { useWebRTCStream } from './hooks/useWebRTCStream';
import { wsMessages } from './helpers/constants';
import { useIsHabitatTabbed, useShowMobileControls } from '../../hooks';
import { setHabitatStreamStarted } from '../../routes/habitat/actions';
import { updateUserProperty } from '../../redux/actions';

import { getDeviceType } from '../../helpers';

import style from './style.scss';

const {
  PLAY_STARTED,
  ERROR,
  CLOSED,
  INITIALIZED,
  PLAY_PAUSED,
  LOADING,
} = wsMessages;

const Stream = ({
  width = 620,
  height = 355,
  streamId,
  interactive,
  userId,
  showContentExplorer,
  isStreamOn,
  mode,
  productId,
  hasWatchedFreemiumTalk,
  setHabitatStreamStartedAction,
  updateUserPropertyAction,
}) => {
  const videoRef = useRef();
  const timeoutRef = useRef();
  const containerRef = useRef(null);
  const { socket } = useContext(GlobalsContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const showMobileControls = useShowMobileControls();
  const isTabbed = useIsHabitatTabbed();
  const [showControls, setShowControls] = useState(false);

  const logStreamStatus = useCallback((data) => {
    if (!hasWatchedFreemiumTalk && productId === 'FREEMIUM' && mode === 'liveTalk') {
      post(buildURL('users/steps'), { step: 'hasWatchedFreemiumTalk', value: true })
        .then((data) => updateUserPropertyAction(data))
        .catch((err) => console.error('Error while updating hasWatchedFreemiumTalk status', err));
    }

    if (data?.startTime && data?.streamId) {
      socket.emit('logWebrtcStats', {
        userId,
        deviceType: getDeviceType(),
        userAgent: navigator.userAgent,
        productId,
        ...data,
      })
    }
  }, [socket, userId, productId, hasWatchedFreemiumTalk, mode, updateUserPropertyAction]);

  const handleScreenClick = useCallback(() => {
    if (isTabbed) {
      const action = showControls ? 'show' : 'hide';
      setShowControls(!showControls);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (action === 'show') {
        timeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 5000);
      }
    }
  }, [isTabbed, showControls]);

  const {
    streamStatus,
    startPlaying,
    stopPlaying,
    pausePlaying,
    initializeAdapter,
  } = useWebRTCStream(streamId, isStreamOn, videoRef, 'viewer', logStreamStatus);

  useEffect(() => {
    if (isInitialized && isStreamOn && streamStatus === CLOSED && videoRef.current) {
      initializeAdapter();
    }

    if (isStreamOn && streamStatus === INITIALIZED) {
      startPlaying();
    }

    if (!isStreamOn && streamStatus === PLAY_STARTED) {
      stopPlaying();
    }

    if (isStreamOn && streamStatus === PLAY_STARTED && mode !== 'liveTalk') {
      setHabitatStreamStartedAction(true);
    }
  }, [
    streamStatus,
    isStreamOn,
    startPlaying,
    stopPlaying,
    pausePlaying,
    videoRef,
    isInitialized,
    initializeAdapter,
    mode,
    setHabitatStreamStartedAction,
  ]);

  const pauseStreamHandler = useCallback(() => {
    pausePlaying()
  }, [pausePlaying]);

  useEffect(() => () => {
    stopPlaying();
  }, [streamId, isStreamOn, stopPlaying])

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <LiveStreamContext.Provider value={{ videoRef }}>
      {interactive && isTabbed && <TimeBar className={style.timeBar} />}

      <div
        className={style.streamContainer}
        style={{
          height,
        }}
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleScreenClick}
      >
        <div
          className={classnames(style.videoContainer, {
            [style.loading]: streamStatus !== PLAY_STARTED,
          })}
        >
          {!isTabbed && mode !== 'liveTalk' && isStreamOn && showContentExplorer && <ContentExplorer />}
          {isStreamOn && (
            <div>
              <video
                ref={videoRef}
                autoPlay
                controls={false}
                muted
                playsInline
                key={streamId}
                style={{ width, height }}
              />
              <VideoControls
                ref={videoRef}
                showControls={showControls}
                showPlayControl={mode !== 'liveTalk'}
                showVolumeControl
                showFullscreenControl
                hasCameraControls={mode !== 'liveTalk'}
                onPauseHandler={pauseStreamHandler}
                isPlaying={streamStatus === PLAY_STARTED}
                isLoading={streamStatus === LOADING}
              />
            </div>
          )}

          {streamStatus === PLAY_STARTED && isStreamOn && interactive && (
            <StreamInteractiveArea
              width={width}
              height={height}
              parentRef={containerRef}
            />
          )}

          {(interactive && isStreamOn && (hasPermission('habitat:edit-stream') || hasPermission('habitat:switch-stream'))) && <AdminButton />}
        </div>

        {/* mobile controls */}
        {streamStatus === PLAY_STARTED && interactive && showMobileControls && isStreamOn && (
          <MobileControls />
        )}

        {![ERROR, PLAY_STARTED, CLOSED, PLAY_PAUSED].includes(streamStatus) && (
          <Fallback type="loading" mode={mode} />
        )}

        {streamStatus === PLAY_PAUSED && (
          <Fallback type="paused" onClick={pauseStreamHandler} />
        )}

        {streamStatus === ERROR && (
          <>
            <Fallback type="error" />
            {(interactive && (hasPermission('habitat:edit-stream') || hasPermission('habitat:switch-stream'))) && <AdminButton />}
          </>
        )}
      </div>
    </LiveStreamContext.Provider>
  );
};

export default connect((
  {
    user:
      {
        userId,
        showContentExplorer,
        subscription: { productId },
        hasWatchedFreemiumTalk,
      },
  },
) => (
  {
    userId,
    showContentExplorer,
    productId,
    hasWatchedFreemiumTalk,
  }
), {
  setHabitatStreamStartedAction: setHabitatStreamStarted,
  updateUserPropertyAction: updateUserProperty,
})(Stream);
