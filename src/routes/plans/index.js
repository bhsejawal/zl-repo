import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';
import SubscriptionManager from 'Components/SubscriptionManager';

import ZoolifeBenefits from 'Components/Benefits';

const Plans = () => {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      height="100%"
      responsive
      direction="column"
      fill={['medium', 'large'].includes(size)}
      overflow="auto"
    >
      <Box
        height={{ min: 'unset' }}
        flex="grow"
      >
        <Box width={{ max: '650px' }} alignSelf="center">
          <Heading level={2} textAlign="center" fill>
            Keep exploring with a Zoolife pass.
          </Heading>
          <Text textAlign="center" size="xlarge">
            50% of your purchase directly funds animal care &amp; conservation efforts worldwide.
          </Text>
        </Box>
        <SubscriptionManager />
      </Box>
      <ZoolifeBenefits />
    </Box>
  );
};

export default Plans;
