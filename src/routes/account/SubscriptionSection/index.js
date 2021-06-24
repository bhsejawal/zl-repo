import { useContext } from 'preact/hooks';

import {
  Box,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';

import background from 'Components/SubscriptionManager/plansBackground.png';

import SubscriptionManager from 'Components/SubscriptionManager';
import ZoolifeBenefits from 'Components/Benefits';

const SubscriptionSection = () => {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <Box
        fill={['medium', 'large'].includes(size)}
        responsive
        direction="column"
      >
        <Box
          fill
          basis="full"
          background={{
            image: `url(${background})`,
            size: 'contain',
            position: 'bottom',
            repeat: 'no-repeat',
            attachment: 'fixed',
          }}
        >
          <Box pad={{ vertical: "large", horizontal: "25%" }}>
            <Heading level={['xsmall', 'small'].includes(size) ? 3 : 1} textAlign="center" fill size="25px" weight={700}>
              Manage Subscription
            </Heading>
            <Text textAlign="center" size="16px">
              50% of your ticket directly funds conservation
              &amp; animal care efforts led by our AZA-accredited partners.
            </Text>
          </Box>
          <SubscriptionManager />
        </Box>
        <ZoolifeBenefits />
      </Box>
    </>
  )
};

export default SubscriptionSection;
