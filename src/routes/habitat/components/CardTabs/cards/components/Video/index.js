import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlayCircle } from '@fortawesome/pro-regular-svg-icons';
import classnames from 'classnames';
import Loader from 'Components/Loader';

import style from './style.scss';

const Video = ({
  url,
  className,
  onPlay,
  onStop,
}) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const onPlayClick = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  const onPause = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      onPlay?.();
    } else {
      onStop?.();
    }
  }, [isPlaying]);

  useEffect(() => {
    const onPaused = () => setIsPlaying(false);
    const onLoadedData = () => setShowLoader(false);
    const el = videoRef.current;

    el.addEventListener('loadeddata', onLoadedData);
    el.addEventListener('pause', onPaused);

    // Safari will not load the video if we don't explicity call it
    // The issue was observed on Safari iPadOs and Older Safaris on MacOs
    el.load();

    return () => {
      el.removeEventListener('pause', onPaused);
      el.removeEventListener('loadeddata', onLoadedData);
    };
  }, [url]);

  return (
    <div className={classnames(style.video, className)}>
      <video ref={videoRef} muted playsInline src={url}>
        Sorry, your browser doesn&quot;t support embedded videos.
      </video>

      {showLoader && <Loader className={style.videoLoader} />}

      <FontAwesomeIcon
        className={classnames(style.control, { [style.hidden]: isPlaying || showLoader })}
        color="#fff"
        size="3x"
        onClick={onPlayClick}
        icon={faPlayCircle}
      />

      <FontAwesomeIcon
        className={classnames(style.control, style.pause, {
          [style.hidden]: !isPlaying || showLoader,
        })}
        color="#fff"
        size="3x"
        onClick={onPause}
        icon={faPause}
      />
    </div>
  );
};

export default Video;
