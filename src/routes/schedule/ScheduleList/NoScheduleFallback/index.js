import { Image, Box, Text } from 'grommet';

import scheduleFallback from './scheduleFallback.png';

const NoScheduleFallback = () => (
  <Box fill justify="center" align="center" pad="xlarge">
    <Image src={scheduleFallback} width="150" />
    <Text textAlign="center" size="xlarge" color="white" margin={{ top: 'large' }} weight="900">Sorry! There aren’t any talks available.</Text>
    <Text textAlign="center" size="medium" color="white" margin={{ top: 'medium' }}>Please try broadening your search.</Text>
  </Box>
)

export default NoScheduleFallback;
