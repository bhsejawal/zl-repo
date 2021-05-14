import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlayCircle } from '@fortawesome/pro-regular-svg-icons';
import classnames from 'classnames';
import Loader from 'Components/async/Loader';

import style from './style.scss';

const Video = ({ url, className }) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const onPlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  const onPause = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    const onPaused = () => setIsPlaying(false);
    const onLoadedData = () => setShowLoader(false);
    const el = videoRef.current;

    el.addEventListener('loadeddata', onLoadedData);
    el.addEventListener('pause', onPaused);

    return () => {
      el.removeEventListener('pause', onPaused);
      el.removeEventListener('loadeddata', onLoadedData);
    };
  }, [url]);

  return (
    <div className={classnames(style.video, className)}>
      <video ref={videoRef} muted src={url}>
        Sorry, your browser doesn&quot;t support embedded videos.
      </video>

      {showLoader && <Loader className={style.videoLoader} />}

      <FontAwesomeIcon
        className={classnames(style.control, { [style.hidden]: isPlaying || showLoader })}
        color="#fff"
        size="3x"
        onClick={onPlay}
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
