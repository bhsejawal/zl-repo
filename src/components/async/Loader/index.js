import { Layer, Box } from 'grommet';
import Lottie from 'react-lottie-player';
import loader from '../../../assets/loader.json';

const Loader = ({ height = '100%' }) => (
  <Box justify="center" align="center" fill>
    <Lottie
      loop
      play
      animationData={loader}
      style={{ height }}
  />
  </Box>
);

export default Loader;

export const LoaderOverlay = ({ showLoader, full, height = '100%' }) => {
  if (!showLoader) {
    return null;
  }

  return (
    <Layer
     animation="fadeIn"
     full={full}
    >
      <Loader height={height} />
    </Layer>
  );
};
