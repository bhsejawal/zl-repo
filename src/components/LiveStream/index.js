import { h } from 'preact';
import { useRef } from 'preact/hooks';

import StreamInteractiveArea from './StreamInteractiveArea';

import { useWebRTCStream, streamStatuses } from './hooks/useWebRTCStream';

import style from './style.scss';

const { PLAYING, ERROR } = streamStatuses;

const Stream = ({
  width = 620,
  height = 355,
  streamId,
  interactive,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const streamStatus = useWebRTCStream(streamId, videoRef);
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
        ref={videoRef}
        autoPlay
        controls
        muted
        playsinline
        style={{ width, height }}
      />

      {streamStatus === PLAYING
        && interactive
        && <StreamInteractiveArea width={width} height={height} parentRef={containerRef} />}

      {![ERROR, PLAYING].includes(streamStatus) && (
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
    </div>
  );
}
export default Stream;
