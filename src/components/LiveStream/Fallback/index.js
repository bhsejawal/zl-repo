import { connect } from 'react-redux';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { faPlay } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Heading,
  Text,
  Anchor,
  Avatar,
} from 'grommet';

import Loader from 'Components/Loader';
import { openContactUsModal } from 'Components/modals/ContactUs/actions'

import { useIsMobileSize } from '../../../hooks';

import background from './videoBackground.png';

import style from './style.scss';

const Fallback = ({
  type,
  profileImage,
  mode,
  openContactUsModalAction,
  onClick,
}) => {
  const isMobileSize = useIsMobileSize();
  const clickHandler = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  }

  return (
    <Box
      background={{image: `url(${background})`}}
      fill
      justify="center"
      align="center"
      className={style.fallbackMessage}
    >
      {type === 'loading' && (
        <>
          <Box height={mode === 'liveTalk' ? '50%' : ''}>
            <Loader color="#a0b6ec" fill />
          </Box>
          <Box width={{ max: '80%' }} align="center">
            {mode === 'liveTalk' && (
              <Text color="white" size="xlarge" margin={{ top: '10px' }}>
                Q&amp;A is loading...
              </Text>
            )}
            {mode !== 'liveTalk' && (
              <>
                <Heading level="3" color="white" margin={{ top: 'medium' }} textAlign="center">
                  Hang in there, nature is coming!
                </Heading>
                <Text color="white" margin={{ top: 'large' }} size="large">
                  Not loading?&nbsp;
                  <Anchor color="white" className={style.contactUs} onClick={openContactUsModalAction}>Contact Us</Anchor>
                </Text>
              </>
            )}
          </Box>
        </>
      )}
      {type === 'error' && (
        <>
          <FontAwesomeIcon icon={faTimesCircle} size="8x" color="white" />
          <Box width={{ max: '400px' }} align="center">
            <Heading level="3" color="white" margin={{ top: 'large' }} textAlign="center">
              Uh oh! Looks like the monkeys mixed up the wires again.
            </Heading>
            <Text color="white" size="xlarge">
              Try refreshing the page
            </Text>

            <Text color="white" margin={{ top: 'large' }} size="large">
              Still not working?&nbsp;
              <Anchor color="white" className={style.contactUs} onClick={openContactUsModalAction}>Contact Us</Anchor>
            </Text>
          </Box>
        </>
      )}

      {type === 'paused' && (
        <Box onClick={clickHandler} justify="center" align="center" fill pad={{ horizontal: 'xsmall' }}>
          <FontAwesomeIcon icon={faPlay} size={ isMobileSize ? '1x' : '4x' } color="white" />
          <Box width={{ max: '400px' }} align="center">
            {isMobileSize && (
              <Text
                color="white"
                textAlign="center"
                margin={{ top: 'small' }}
              >
                Your video is paused
              </Text>
            )}
            {!isMobileSize && (
              <Heading
                level={3}
                color="white"
                margin={{ top: 'large' }}
                textAlign="center"
              >
                Your video is paused
              </Heading>
            )}
            <Text color="white" size={ isMobileSize ? 'small' : 'xlarge' }>
              Click to resume playing.
            </Text>
          </Box>
        </Box>
      )}
      {type === 'offline' && (
        <>
          <Avatar src={profileImage} size="xlarge" margin={{ top: 'small' }} />
          <Heading level="3" color="white" margin="medium">
            Looks like the animals are busy.
          </Heading>
          <Text color="white" size="xlarge">
            Check the schedule for when they&apos;ll be back
          </Text>

          <Text color="white" className={style.learnText} size="large">
            Learn more about their world below.
          </Text>
        </>
      )}
    </Box>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { profileImage } } }) => ({ profileImage }),
  { openContactUsModalAction: openContactUsModal },
)(Fallback);
