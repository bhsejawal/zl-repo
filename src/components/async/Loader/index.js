import { Box } from 'grommet';

import Lottie from 'react-lottie-player';

import greenLoader from 'Assets/loader.json';
import whiteLoader from 'Assets/whiteLoader.json';

const loaders = {
  white: whiteLoader,
  default: greenLoader,
}

const Loader = ({
  fill,
  variant = 'default',
  height = '200px',
  width = '200px',
}) => (
  <Box justify="center" align="center" fill={fill} >
    <Lottie
      loop
      play
      animationData={loaders[variant]}
      direction={-1}
      style={{ height, width }}
      speed={1.5}
    />
  </Box>
);

export default Loader;
