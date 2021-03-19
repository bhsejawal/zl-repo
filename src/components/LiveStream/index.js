import { h } from 'preact';
import { useRef, useContext, useCallback } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { connect } from 'react-redux';

import Loader from 'Components/async/Loader';

import { GlobalsContext } from 'Shared/context';
import { hasPermission } from 'Components/Authorize';

import StreamInteractiveArea from './StreamInteractiveArea';
import VideoControls from '../VideoControls';
import AdminButton from './AdminButton';

import { useWebRTCStream } from './hooks/useWebRTCStream';
import { wsMessages } from './helpers/constants';

import style from './style.scss';

const { PLAY_STARTED, ERROR } = wsMessages;

const Stream = forwardRef(({
  width = 620,
  height = 355,
  streamId,
  interactive,
  customControls,
  userId,
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

  const { streamStatus } = useWebRTCStream(streamId, passedRef || videoRef, 'viewer', logStreamStatus);

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
        controls
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

      {![ERROR, PLAY_STARTED].includes(streamStatus) && (
        // TODO: Add fallback message/image for error when design team provide us
        <div className={style.fallbackMessage}>
          <Loader />
        </div>
      )}

      {streamStatus === ERROR && (
        // TODO: Add fallback message/image for error when design team provide us
        <div className={style.fallbackMessage}>
          <p>
            Error playing the stream, please, refresh the page and, if the error persists,
            contact the support team.
          </p>
        </div>
      )}
      {customControls && <VideoControls ref={passedRef || videoRef} />}

      {(interactive && hasPermission('habitat:edit-stream')) && <AdminButton />}
    </div>
  );
});

export default connect(({ user: { userId }}) => ({ userId }))(Stream);
