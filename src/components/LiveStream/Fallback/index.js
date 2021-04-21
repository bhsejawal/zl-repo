import { connect } from 'react-redux';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Heading,
  Text,
  Anchor,
  Avatar,
} from 'grommet';

import Loader from 'Components/async/Loader';
import background from './videoBackground.png';

import style from './style.scss';

const Fallback = ({ type, profileImage, mode }) => (
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
                {/* TODO: ADD Contact US POPUP */}
                <Anchor color="white" className={style.contactUs}>Contact Us</Anchor>
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
            {/* TODO: ADD Contact US POPUP */}
            <Anchor color="white" className={style.contactUs}>Contact Us</Anchor>
          </Text>
        </Box>
      </>
    )}
    {type === 'offline' && (
      <>
        <Avatar src={profileImage} size="xlarge" />
        <Heading level="3" color="white" margin={{ top: 'large' }}>
          Looks like the animals are busy.
        </Heading>
        <Text color="white" size="xlarge">
          Check the schedule for when they&apos;ll be back
        </Text>

        <Text color="white" margin={{ top: 'large' }} size="large">
          Learn more about their world below.
        </Text>
      </>
    )}
  </Box>
);

export default connect(
  ({ habitat: { habitatInfo: { profileImage } } }) => ({ profileImage }),
)(Fallback);
