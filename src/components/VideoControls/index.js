import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { Box, Grommet, RangeInput as InputRange } from 'grommet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faExpand } from '@fortawesome/free-solid-svg-icons';
import { faVolume, faVolumeMute, faEllipsisV } from '@fortawesome/pro-solid-svg-icons';

import style from './style.scss';

const customThemeRangeInput = {
  global: {
    spacing: '12px',
  },
  rangeInput: {
    track: {
      height: '6px',
      extend: () => `border-radius: 10px`,
      lower: {
        color: 'white',
        opacity: 0.7,
      },
      upper: {
        color: 'white',
        opacity: 0.3,
      },
    },
    thumb: {
      color: 'white',
    },
  },
};

const VideoControls = forwardRef(({}, ref) => {
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const video = ref.current;

  useEffect(() => {
    if (video) {
      video.controls = false;
      video.play();
      setIsPlaying(!video.paused);
    }
  }, [video]);

  const togglePlay = () => {
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  const toggleMute = () => {
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  const onVolumeChange = ({ target: { value }}) => {
    video.volume = value;
    setVolume(value);
    video.muted = value === '0'
    setIsMuted(video.muted);
  };

  const openFullscreen = () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE11 */
      video.msRequestFullscreen();
    }
  };

  const showControlsHandler = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 5000);
  };

  if (!video) {
    return null;
  }

  if (!showControls) {
    return (
      <div className={style.controlsHidden}>
        <button type="button" onClick={showControlsHandler}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
    )
  }

  return (
    <div className={style.controls}>
      <button type="button" onClick={togglePlay}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>
      <button type="button" onClick={toggleMute} className={style.soundButton}>
        <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolume} />
      </button>
      <Grommet theme={customThemeRangeInput} className={style.rangeInput}>
        <Box direction="row" align="center">
          <Box align="center" width="small">
            <InputRange
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={onVolumeChange}
            />
          </Box>
        </Box>
      </Grommet>
      <button type="button" onClick={openFullscreen}>
        <FontAwesomeIcon icon={faExpand} />
      </button>
    </div>
  );
});

export default VideoControls;
