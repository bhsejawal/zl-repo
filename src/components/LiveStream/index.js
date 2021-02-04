import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

import StreamInteractiveArea from './StreamInteractiveArea';
import VideoControls from '../VideoControls';

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
}, passedRef) => {
  const videoRef = useRef();
  const containerRef = useRef(null);
  const streamStatus = useWebRTCStream(streamId, passedRef || videoRef);
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

      {streamStatus === PLAY_STARTED
      && interactive
      && <StreamInteractiveArea width={width} height={height} parentRef={containerRef} />}

      {![ERROR, PLAY_STARTED].includes(streamStatus) && (
        // TODO: Add fallback message/image for error when design team provide us
        <div className={style.fallbackMessage}>
          <p>Loading stream...</p>
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
    </div>
  );
});

export default Stream;
