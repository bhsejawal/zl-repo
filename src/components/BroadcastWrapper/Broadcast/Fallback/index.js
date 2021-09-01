import { Box, Text } from 'grommet';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from 'Components/Loader';

import background from '../../hostBackground.png';

const BroadcastFallback = ({ type, text }) => (
  <Box
    background={{image: `url(${background})`}}
    fill
    width="100%"
    height="100%"
    justify="center"
    align="center"
  >
    { type === 'loading' && <Loader color="#a0b6ec" width="50%" />}
    { type === 'error' && (
      <Box justify="center" align="center">
        <FontAwesomeIcon icon={faTimesCircle} size="2x" color="white" />
        <Text size="xlarge" color="white" margin={{ top: '10px' }}>
          {text}
        </Text>
      </Box>
    )}
  </Box>
);

export default BroadcastFallback;
