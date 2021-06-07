import { Box, Layer } from 'grommet';
import Loader from '../Loader';

const LoaderModal = ({
  full,
  height,
  width,
}) => (
  <Layer
    animation="fadeIn"
    full={full}
  >
    <Box fill justify="center">
      <Loader height={height} width={width} fill={full} />
    </Box>
  </Layer>
);

export default LoaderModal;
