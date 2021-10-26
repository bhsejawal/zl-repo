import { Box, Text } from 'grommet';

const TipContent = ({ message }) => (
  <Box direction="row" align="center">
    <svg viewBox="0 0 22 22" version="1.1" width="22px" height="22px">
      <polygon
        fill="white"
        points="6 2 18 12 6 22"
        transform="matrix(-1 0 0 1 30 0)"
      />
    </svg>
    <Box background="white" direction="row" pad="small" round="xsmall">
      <Text color="black">{message}</Text>
    </Box>
  </Box>
);

export default TipContent;
