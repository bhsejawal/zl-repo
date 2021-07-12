import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { Box, Grommet, RangeInput as InputRange } from 'grommet';
import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faExpand } from '@fortawesome/free-solid-svg-icons';
import { faVolume, faVolumeMute, faCompress } from '@fortawesome/pro-solid-svg-icons';
import RoundButton from 'Components/RoundButton';
import { getDeviceType } from '../../helpers';

import { useIsHabitatTabbed } from '../../hooks';

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

const VideoControls = forwardRef(({
  showControls,
  showPlayControl,
  showVolumeControl,
  showFullscreenControl,
  showPIPControl,
  hasCameraControls,
}, ref) => {
  const [showVolumeBar, setShowVolumeBar] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const volumeButtonRef = useRef(null);
  const isTabbedView = useIsHabitatTabbed();

  useEffect(() => {
    const handleFullscreenMode = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    }

    document.addEventListener('fullscreenchange', handleFullscreenMode);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenMode);
  }, []);

  // TODO: we need to refactor this
  // there are a lot of references passed between different components
  // and this is receiving a reference that's not a video element
  // so the "video.play()"" is throwing errors
  const video = ref.current;

  if (!showControls) {
    return null;
  }

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
    let target;

    if (isFullscreen) {
      target = document;
    } else {
      target = hasCameraControls && getDeviceType() === 'desktop' ? document.body : video;
    }

    if (!isFullscreen) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) { /* Safari */
        target.webkitRequestFullscreen();
      } else if (target.msRequestFullscreen) { /* IE11 */
        target.msRequestFullscreen();
      }
    } else if (target.exitFullscreen) {
      target.exitFullscreen();
    } else if (target.webkitExitFullscreen) { /* Safari */
      target.webkitExitFullscreen();
    } else if (target.msExitFullscreen) { /* IE11 */
      target.msExitFullscreen();
    }
  };

  const togglePictureInPicture = () => {
    video.requestPictureInPicture();
  }

  if (!video) {
    return null;
  }

  return (
    <Box
      className={classnames(style.videoControls, {[style.mobile]: isTabbedView})}
      direction="row"
      gap="small"
    >
      {showPlayControl && (
        <RoundButton
        onClick={togglePlay}
        width="28"
        backgroundColor="var(--hunterGreenMediumDark)"
        color="white"
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </RoundButton>
      )}

      {showVolumeControl && (
        <div
        ref={volumeButtonRef}
        onMouseEnter={() => setShowVolumeBar(true)}
        onMouseLeave={() => setShowVolumeBar(false)}
        className={classnames(style.volumeWrapper, {
          [style.expanded]: showVolumeBar && !isTabbedView,
        })}
        >
          <RoundButton
            onClick={toggleMute}
            width="28"
            backgroundColor="var(--hunterGreenMediumDark)"
            color="white"
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolume} />
          </RoundButton>
          {!isTabbedView && showVolumeBar && volumeButtonRef.current && (
            <div
              className={classnames(style.volumeContainer, {[style.expanded]: showVolumeBar})}
            >
              <Grommet theme={customThemeRangeInput} className={style.rangeInput}>
                <InputRange
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={onVolumeChange}
                />
              </Grommet>
            </div>
          )}
        </div>

      )}

      {showPIPControl && (
        <RoundButton
        onClick={togglePictureInPicture}
        width="28"
        backgroundColor="var(--hunterGreenMediumDark)"
        color="white"

        >
          <FontAwesomeIcon icon={faCompress} />
        </RoundButton>
      )}

      {showFullscreenControl && (
        <RoundButton
          onClick={openFullscreen}
          width="28"
          backgroundColor="var(--hunterGreenMediumDark)"
          color="white"
        >
          <FontAwesomeIcon icon={faExpand} />
        </RoundButton>

      )}
    </Box>
  );
});

export default VideoControls;
