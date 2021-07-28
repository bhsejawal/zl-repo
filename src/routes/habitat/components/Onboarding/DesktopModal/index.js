import { h } from 'preact';
import { useState, useRef, useContext } from 'preact/hooks';
import { Layer, ResponsiveContext, Box } from 'grommet';
import classnames from 'classnames';
import { OutlineButton, PrimaryButton } from 'Components/Buttons';

import style from './style.scss';

const DesktopOnboarding = ({ updateOnboarding, error }) => {
  const size = useContext(ResponsiveContext);
  const [showButtons, setShowButtons] = useState();
  const videoRef = useRef();

  const isSmallScreen = ['xsmall', 'small'].includes(size);

  const replayHandler = () => {
    if (videoRef) {
      videoRef.current.currentTime = '0';
      videoRef.current.play();
      setShowButtons(false);
    }
  };

  return (
    <Layer background="transparent">
      <Box className={classnames(style.onboarding, { [style.mobile]: isSmallScreen })}>
        <Box className={style.onboardingWrapper}>
          {showButtons && (
            <Box direction="row" justify="center" className={style.buttonsWrapper}>
              <OutlineButton
                className={style.replayButton}
                label="Replay"
                onClick={replayHandler}
                margin={{right: '28px'}}
                size={isSmallScreen ? 'medium' : 'large'}
              />
              <PrimaryButton
                onClick={updateOnboarding}
                label={error ? 'Try Again!' : 'Enter Habitat'}
                size={isSmallScreen ? 'medium' : 'large'}
              />
            </Box>
          )}
          <video
            ref={videoRef}
            muted
            autoPlay
            controls={false}
            playsInline
            onEnded={() => setShowButtons(true)}
          >
            <source src="/assets/zoolife_onboarding.mp4" />
          </video>
        </Box>
      </Box>
    </Layer>
  );
};

export default DesktopOnboarding;
