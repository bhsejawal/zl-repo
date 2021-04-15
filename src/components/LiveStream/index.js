import { h } from 'preact';
import {
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { connect } from 'react-redux';

import { GlobalsContext } from 'Shared/context';
import { hasPermission } from 'Components/Authorize';

import Fallback from './Fallback';

import StreamInteractiveArea from './StreamInteractiveArea';
import VideoControls from '../VideoControls';
import AdminButton from './AdminButton';

import { useWebRTCStream } from './hooks/useWebRTCStream';
import { wsMessages } from './helpers/constants';

import style from './style.scss';

const {
  PLAY_STARTED,
  ERROR,
  CLOSED,
  INITIALIZED,
} = wsMessages;

const Stream = forwardRef(({
  width = 620,
  height = 355,
  streamId,
  interactive,
  customControls,
  userId,
  isStreamOn,
  mode,
}, passedRef) => {
  const videoRef = useRef();
  const containerRef = useRef(null);
  const { socket } = useContext(GlobalsContext);

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
  } = useWebRTCStream(streamId, isStreamOn, passedRef || videoRef, 'viewer', logStreamStatus);

  useEffect(() => {
    if (isStreamOn && streamStatus === CLOSED && videoRef.current) {
      initializeAdapter();
    }

    if (isStreamOn && streamStatus === INITIALIZED) {
      setTimeout(() => startPlaying(), 5000);
    }

    if (!isStreamOn && streamStatus === PLAY_STARTED) {
      stopPlaying();
    }
  }, [streamStatus, isStreamOn, startPlaying, stopPlaying, videoRef]);

  if (!isStreamOn) {
    return (
      <div
        className={style.streamContainer}
        style={{
          width,
          height,
          maxWidth: width,
        }}
      >
        <Fallback type="offline" />
      </div>
    )
  }

  return (
    <div
      className={style.streamContainer}
      style={{
        width,
        height,
        maxWidth: width,
      }}
      ref={containerRef}
    >
      <video
        ref={passedRef || videoRef}
        autoPlay
        controls={!customControls}
        muted
        playsInline
        style={{ width, height }}
      />

      {streamStatus === PLAY_STARTED && interactive && (
        <StreamInteractiveArea
          width={width}
          height={height}
          parentRef={containerRef}
        />
      )}

      {![ERROR, PLAY_STARTED, CLOSED].includes(streamStatus) && (
        <Fallback type="loading" mode={mode} />
      )}

      {streamStatus === ERROR && (
        <Fallback type="error" />
      )}

      {streamStatus === CLOSED && (
        <Fallback type="offline" />
      )}

      {customControls && <VideoControls ref={passedRef || videoRef} />}

      {(interactive && hasPermission('habitat:edit-stream')) && <AdminButton />}
    </div>
  );
});

export default connect((
  { user: { userId }, habitat: { habitatInfo: { isStreamOn } } },
) => (
  { userId, isStreamOn }
))(Stream);
