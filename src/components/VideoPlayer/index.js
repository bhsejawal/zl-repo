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

import { useIsHabitatTabbed } from '../../hooks';

const VideoPlayer = ({
  videoURL,
  videoId,
  width,
  height,
  onEnd,
  onLoad,
  className,
  autoPlay = false,
  muted = false,
  logView = true,
  isGuest,
  onNextHandler,
}) => {
  const videoRef = useRef();
  const timeoutRef = useRef();
  const [hasUserPlayed, setHasUserPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay );
  const [isLoading, setIsLoading] = useState(true);
  const [videoLength, setVideoLength] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const isMobile = useIsHabitatTabbed();

  useEffect(() => {
    if (!isMobile) {
      setShowControls(true);
    }
  }, [isMobile]);

  const handleScreenClick = useCallback(() => {
    if (isMobile) {
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
  }, [isMobile, showControls]);

  const { put: setVideoAsViewed } = useFetch(
    buildURL(`/videos/${videoId}/viewed`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onPlay = useCallback(() => {
    handleScreenClick();
    if (!hasUserPlayed && logView) {
      setHasUserPlayed(true);
      if (!isGuest) {
        setVideoAsViewed();
      }
    }
    setIsPlaying(true);
  }, [handleScreenClick, hasUserPlayed, isGuest, logView, setVideoAsViewed]);

  const onPause = () => {
    handleScreenClick();
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

  const onLoadMetadata = useCallback(() => {
    setVideoLength(Math.round(videoRef.current.duration));
    if (autoPlay) {
      videoRef.current.play();
    }
  }, [autoPlay]);

  const onLoadedData = useCallback(() => {
    if (typeof onLoad === 'function') {
      onLoad();
    }
    setIsLoading(false)
  }, [onLoad])

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

  // const onSuspendeHandler = useCallback(() => {
  //   if (isMobile && !isPlaying) {
  //     setIsLoading(false);
  //     setIsPlaying(false);
  //     handleScreenClick();
  //   }
  // }, [handleScreenClick, isMobile, isPlaying]);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.addEventListener('ended', onEndHandler);
      videoRef.current.addEventListener('play', onPlay);
      videoRef.current.addEventListener('timeupdate', onTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', onLoadMetadata);
      videoRef.current.addEventListener('loadeddata', onLoadedData);
      // videoRef.current.addEventListener('suspend', onSuspendeHandler);
    }

    return () => {
      if (videoRef?.current) {
        videoRef.current.removeEventListener('ended', onEndHandler);
        videoRef.current.removeEventListener('play', onPlay);
        videoRef.current.removeEventListener('timeupdate', onTimeUpdate);
        videoRef.current.removeEventListener('loadedmetadata', onLoadMetadata);
        videoRef.current.removeEventListener('loadeddata', onLoadedData)
        // videoRef.current.removeEventListener('suspend', onSuspendeHandler);
      }
    }
  }, [
    videoRef,
    videoURL,
    onEndHandler,
    onPlay,
    onTimeUpdate,
    onLoadMetadata,
    onLoadedData,
    // onSuspendeHandler,
  ]);

  return (
    <div
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleScreenClick}
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        maxHeight: '100%',
      }}
    >
      {isLoading && <Loader fill absolute />}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={`${videoURL}#t=0.1`}
        playsInline
        style={{ width, height }}
        ref={videoRef}
        muted={muted}
        className={className}
      />
      <VideoControls
        ref={videoRef}
        showControls={showControls}
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
        onNextHandler={onNextHandler}
      />
    </div>
  );
};

export default VideoPlayer;
