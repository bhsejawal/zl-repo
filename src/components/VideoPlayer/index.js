import {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'preact/hooks';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';

import Loader from 'Components/Loader';
import VideoControls from 'Components/VideoControls';

const VideoPlayer = ({
  videoURL,
  videoId,
  width,
  height,
  onEnd,
  autoPlay,
  muted = false,
  logView = true,
}) => {
  const videoRef = useRef();
  const [hasUserPlayed, setHasUserPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLength, setVideoLength] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const { put: setVideoAsViewed } = useFetch(
    buildURL(`/videos/${videoId}/viewed`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onPlay = () => {
    if (!hasUserPlayed && logView) {
      setHasUserPlayed(true);
      setVideoAsViewed();
    }
    setIsPlaying(true);
  }

  const onPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }

  const onTimeUpdate = useCallback(() => {
    setTimeElapsed(Math.round(videoRef.current.currentTime));
  }, [])

  const onEndHandler = useCallback(() => {
    setIsPlaying(false);
    if (typeof onEnd === 'function') {
      onEnd();
    }
  }, [onEnd]);

  const onLoadMetadata = () => {
    setVideoLength(Math.round(videoRef.current.duration));
    if (autoPlay) {
      videoRef.current.play();
    }
  };

  const onLoadedData = () => setIsLoading(false);

  const updateVideoTimeHandler = useCallback((value) => {
    videoRef.current.currentTime = value;
  }, []);

  useEffect(() => () => {
    setIsLoading(true);
    setIsPlaying(false);
    setHasUserPlayed(false);
    setVideoLength(0);
    setTimeElapsed(0);
  }, [videoURL]);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.addEventListener('ended', onEndHandler);
      videoRef.current.addEventListener('play', onPlay);
      videoRef.current.addEventListener('timeupdate', onTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', onLoadMetadata);
      videoRef.current.addEventListener('loadeddata', onLoadedData)
    }

    return () => {
      if (videoRef?.current) {
        videoRef.current.removeEventListener('ended', onEndHandler);
        videoRef.current.removeEventListener('play', onPlay);
        videoRef.current.removeEventListener('timeupdate', onTimeUpdate);
        videoRef.current.removeEventListener('loadedmetadata', onLoadMetadata);
        videoRef.current.removeEventListener('loadeddata', onLoadedData)
      }
    }
  }, [videoRef.current, videoURL]);

  return (
    <>
      {isLoading && <Loader fill absolute />}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={videoURL}
        playsInline
        style={{ width, height }}
        ref={videoRef}
        muted={muted}
      />
      <VideoControls
        ref={videoRef}
        showControls
        showPlayControl
        showVolumeControl
        showFullscreenControl
        showSeekBar
        showTimeStats
        mode="vod"
        muted={muted}
        isPlaying={isPlaying}
        key={`${videoURL}-control`}
        onPauseHandler={onPause}
        videoLength={videoLength}
        timeElapsed={timeElapsed}
        updateVideoTimeHandler={updateVideoTimeHandler}
      />
    </>
  );
};

export default VideoPlayer;
