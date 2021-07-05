import { h } from 'preact';
import { connect } from 'react-redux';
import {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'preact/hooks';
import {
  Layer,
  ResponsiveContext,
  Box,
} from 'grommet';
import { OutlineButton, PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';
import useFetch from 'use-http';
import classnames from 'classnames';
import { setUserData } from '../../../redux/actions';

import style from './style.scss';

const Onboarding = ({ isOnboarded, setUserDataAction }) => {
  const size = useContext(ResponsiveContext);
  const [showButtons, setShowButtons] = useState();
  const videoRef = useRef();
  const { post, error, data } = useFetch(buildURL('/users/onboarding'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (!error && data && data.user) {
      setUserDataAction(data.user);
    }
  }, [data, error, setUserDataAction]);

  const isSmallScreen = ['xsmall', 'small'].includes(size);

  const replayHandler = () => {
    if (videoRef) {
      videoRef.current.currentTime = '0';
      videoRef.current.play();
      setShowButtons(false);
    }
  };

  const enterHabitatHandler = () => {
    post();
  };

  if (isOnboarded) {
    return null;
  }

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
                onClick={enterHabitatHandler}
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

export default connect(
  ({ user: { isOnboarded }}) => ({ isOnboarded }),
  { setUserDataAction: setUserData },
)(Onboarding);
