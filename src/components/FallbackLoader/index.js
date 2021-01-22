import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { Box, Layer } from 'grommet';

const FallbackLoader = () => (
  <Layer>
    <Box pad="medium">
      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
    </Box>
  </Layer>
);

export default FallbackLoader;
