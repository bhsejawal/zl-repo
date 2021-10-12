import { Image, Box, Text } from 'grommet';

import fallbackImage from './image.jpg';

const NoContentFallback = ({ image = fallbackImage, text, subText}) => (
  <Box fill justify="center" align="center" pad="xlarge">
    <Image src={image} width="213" style={{ borderRadius: '50%' }} />
    {text && (
      <Text textAlign="center" size="xlarge" color="white" margin={{ top: 'large' }} weight={900}>{text}</Text>
    )}
    {subText && (
      <Text textAlign="center" size="large" color="white" margin={{ top: 'medium' }}>{subText}</Text>
    )}
  </Box>
)

export default NoContentFallback;
