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
        <Box
          width={{ max: '650px' }}
          height={{ min: 'max-content' }}
          alignSelf="center"
          pad={{ horizontal: ['xsmall', 'small'].includes(size) ? '35px' : '0px'}}
        >
          <Heading level={['xsmall', 'small'].includes(size) ? 3 : 2} textAlign="center" fill>
            Make a contribution to continue exploring Zoolife.
          </Heading>
          <Text textAlign="center" size="xlarge">
            {/* eslint-disable-next-line max-len */}
            50% of your purchase directly funds essential animal care &amp; conservation efforts led by our AZA-accredited partners around the world.
          </Text>
        </Box>
        <SubscriptionManager />
      </Box>
      <ZoolifeBenefits />
    </Box>
  );
};

export default Plans;
