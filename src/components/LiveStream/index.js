import { h } from 'preact';
import {
  useRef,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { Box } from 'grommet';

import { GlobalsContext } from 'Shared/context';
import { hasPermission } from 'Components/Authorize';

import Fallback from './Fallback';

import StreamInteractiveArea from './StreamInteractiveArea';
import AdminButton from './AdminButton';
import LiveStreamContext from './LiveStreamContext';

import { useWebRTCStream } from './hooks/useWebRTCStream';
import { wsMessages } from './helpers/constants';
import { useIsMobileSize } from '../../hooks';
import { MOBILE_CONTROLS_HEIGHT } from '../../routes/habitat/constants';
import TakeSnapshotButton from './StreamInteractiveArea/StreamControls/TakeSnapshotButton';
import ZoomBar from './StreamInteractiveArea/StreamControls/ZoomBar';

import style from './style.scss';

const {
  PLAY_STARTED,
  ERROR,
  CLOSED,
  INITIALIZED,
} = wsMessages;

const Stream = ({
  width = 620,
  height = 355,
  streamId,
  interactive,
  customControls,
  userId,
  isStreamOn,
  mode,
}) => {
  const videoRef = useRef();
  const containerRef = useRef(null);
  const { socket } = useContext(GlobalsContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const isSmallScreen = useIsMobileSize();

  const logStreamStatus = useCallback((data) => {
    if (data?.startTime && data?.streamId) {
      socket.emit('logWebrtcStats', {
        userId,
        ...data,
      })
    }
  }, [socket, userId])

  const {
    streamStatus,
    startPlaying,
    stopPlaying,
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
  }, [
    streamStatus,
    isStreamOn,
    startPlaying,
    stopPlaying,
    videoRef,
    isInitialized,
    initializeAdapter,
  ]);

  useEffect(() => () => {
    stopPlaying();
  }, [streamId, isStreamOn, stopPlaying])

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <LiveStreamContext.Provider value={{ videoRef }}>
      <div
        className={style.streamContainer}
        style={{
          width,
          height: height + (isSmallScreen ? MOBILE_CONTROLS_HEIGHT : 0),
          maxWidth: width,
        }}
        ref={containerRef}
      >
        <div className={style.videoContainer} style={{ width, height }}>
          {isStreamOn && (
            <video
              ref={videoRef}
              autoPlay
              controls={!customControls}
              muted
              playsInline
              key={streamId}
              style={{ width, height }}
            />
          )}

          {streamStatus === PLAY_STARTED && isStreamOn && interactive && (
            <StreamInteractiveArea
              width={width}
              height={height}
              parentRef={containerRef}
            />
          )}

          {(interactive && hasPermission('habitat:edit-stream')) && <AdminButton />}
        </div>

        {/* mobile controls */}
        {streamStatus === PLAY_STARTED && interactive && isSmallScreen && isStreamOn && (
          <Box
            width="100%"
            height={`${MOBILE_CONTROLS_HEIGHT}px`}
            direction="row"
            align="center"
            justify="around"
            background="var(--hunterGreenMediumLight)"
            pad={{ horizontal: "medium" }}
          >
            <Box justify="center" margin={{ right: '20px' }}>
              <TakeSnapshotButton plain />
            </Box>
            <Box flex="grow">
              <ZoomBar horizontal />
            </Box>
          </Box>
        )}

        {![ERROR, PLAY_STARTED, CLOSED].includes(streamStatus) && (
          <Fallback type="loading" mode={mode} />
        )}

        {streamStatus === ERROR && (
          <Fallback type="error" />
        )}

        {(streamStatus === CLOSED || !isStreamOn) && (
          <>
            <Fallback type="offline" />
            {(interactive && hasPermission('habitat:edit-stream')) && <AdminButton />}
          </>
        )}
      </div>
    </LiveStreamContext.Provider>
  );
};

export default connect((
  { user: { userId } },
) => (
  { userId }
))(Stream);
