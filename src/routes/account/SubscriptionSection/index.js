import { useContext } from 'preact/hooks';

import {
  Box,
  Heading,
  ResponsiveContext,
} from 'grommet';

import SubscriptionManager from 'Components/SubscriptionManager';
import SubscriptionBenefits from 'Components/SubscriptionBenefits';

const SubscriptionSection = () => {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      height={{ min: '100%' }}
      background="#24412B"
      responsive
      overflow="auto"
    >
      <Box pad={{ vertical: "large" }} background="#F9FCE7">
        <Heading
          level={['xsmall', 'small'].includes(size) ? 3 : 1}
          textAlign="center"
          size="25px"
          margin="0px"
        >
          Manage Subscription
        </Heading>
        <SubscriptionBenefits />
      </Box>
      <SubscriptionManager showCancelCTA />
    </Box>
  )
};

export default SubscriptionSection;
