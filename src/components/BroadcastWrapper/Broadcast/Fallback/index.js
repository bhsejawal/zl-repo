import { Box, Text } from 'grommet';
import background from 'Assets/hostBackground.png';
import Loader from 'Components/async/Loader';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BroadcastFallback = ({ type, text }) => (
  <Box
    background={{image: `url(${background})`}}
    fill
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
