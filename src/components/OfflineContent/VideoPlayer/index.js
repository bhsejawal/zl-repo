import { useRef, useEffect, useState } from 'preact/hooks';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';

const VideoPlayer = ({
  videoURL,
  videoId,
  width,
  height,
  onEnd,
}) => {
  const videoRef = useRef();
  const [hasUserPlayed, setHasUserPlayed] = useState(false);
  const { put: setVideoAsViewed } = useFetch(
    buildURL(`/videos/${videoId}/viewed`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onPlay = () => {
    if (!hasUserPlayed) {
      setHasUserPlayed(true);
      setVideoAsViewed();
    }
  }

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.addEventListener('ended', onEnd);
      videoRef.current.addEventListener('play', onPlay);
    }

    return () => {
      if (videoRef?.current) {
        videoRef.current.removeEventListener('ended', onEnd);
        videoRef.current.removeEventListener('play', onPlay);
      }
    }
  }, [videoRef.current]);

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={videoURL}
        autoPlay
        playsInline
        controls
        style={{ width, height }}
        ref={videoRef}
      />
    </div>
  );
};

export default VideoPlayer;
