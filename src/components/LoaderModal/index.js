import { Box, Layer } from 'grommet';
import Loader from '../Loader';

const LoaderModal = ({
  full,
  height,
  width,
  background,
}) => (
  <Layer
    animation="fadeIn"
    full={full}
    background={background}
  >
    <Box fill justify="center" background={background || 'white'}>
      <Loader height={height} width={width} fill={full} />
    </Box>
  </Layer>
);

export default LoaderModal;
