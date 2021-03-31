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
    <Layer
      responsive
      full
      plain
      background="transparent"
    >
      <Box className={style.onboarding}>
        <Box justify="center" margin="auto" width={{max: (isSmallScreen ? '100vw' : '80vw')}} style={{position: 'relative'}}>
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
            src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/onboarding.mp4"
            muted
            autoPlay
            controls={false}
            onEnded={() => setShowButtons(true)}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default connect(
  ({ user: { isOnboarded }}) => ({ isOnboarded }),
  { setUserDataAction: setUserData },
)(Onboarding);
