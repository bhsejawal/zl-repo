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

import Fallback from './Fallback';

import StreamInteractiveArea from './StreamInteractiveArea';
import AdminButton from './AdminButton';
import LiveStreamContext from './LiveStreamContext';
import MobileControls from './MobileControls.js';

import { useWebRTCStream } from './hooks/useWebRTCStream';
import { wsMessages } from './helpers/constants';
import { useIsHabitatTabbed, useIsMobileSize } from '../../hooks';
import { MOBILE_CONTROLS_HEIGHT } from '../../routes/habitat/constants';
import { setHabitatStreamStarted } from "../../routes/habitat/actions";

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
  setHabitatStreamStartedAction,
}) => {
  const videoRef = useRef();
  const containerRef = useRef(null);
  const { socket } = useContext(GlobalsContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const isSmallScreen = useIsMobileSize();
  const isTabbed = useIsHabitatTabbed();
  const [showControls, setShowControls] = useState(false);

  const logStreamStatus = useCallback((data) => {
    if (data?.startTime && data?.streamId) {
      socket.emit('logWebrtcStats', {
        userId,
        deviceType: getDeviceType(),
        userAgent: navigator.userAgent,
        ...data,
      })
    }
  }, [socket, userId])

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
          height: height + (isSmallScreen ? MOBILE_CONTROLS_HEIGHT : 0),
        }}
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
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
                showControls={showControls || isTabbed}
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

          {(interactive && isStreamOn && hasPermission('habitat:edit-stream')) && <AdminButton />}
        </div>

        {/* mobile controls */}
        {streamStatus === PLAY_STARTED && interactive && isSmallScreen && isStreamOn && (
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
            {(interactive && hasPermission('habitat:edit-stream')) && <AdminButton />}
          </>
        )}
      </div>
    </LiveStreamContext.Provider>
  );
};

export default connect((
  { user: { userId, showContentExplorer } },
) => (
  { userId, showContentExplorer }
), { setHabitatStreamStartedAction: setHabitatStreamStarted })(Stream);
