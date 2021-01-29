import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlayCircle } from '@fortawesome/pro-regular-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const Video = ({ url, className }) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

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
    const el = videoRef.current;

    el.addEventListener('pause', onPaused);

    return () => {
      el.removeEventListener('pause', onPaused);
    };
  }, [url]);

  return (
    <div className={classnames(style.video, className)}>
      <video ref={videoRef} muted src={url}>
        Sorry, your browser doesn&quot;t support embedded videos.
      </video>

      <FontAwesomeIcon
        className={classnames(style.control, { [style.hidden]: isPlaying })}
        color="#fff"
        size="3x"
        onClick={onPlay}
        icon={faPlayCircle}
      />

      <FontAwesomeIcon
        className={classnames(style.control, style.pause, { [style.hidden]: !isPlaying })}
        color="#fff"
        size="3x"
        onClick={onPause}
        icon={faPause}
      />
    </div>
  );
};

export default Video;
