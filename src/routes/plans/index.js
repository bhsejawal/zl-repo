import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';
import Header from 'Components/Header';
import SubscriptionManager from 'Components/SubscriptionManager';

import background from 'Assets/plansBackground.png';

import ZoolifeBenefits from 'Components/Benefits';

const Plans = () => {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <Header />
      <Box
        margin={{ top: '60px' }}
        fill={['medium', 'large'].includes(size)}
        responsive
        direction="column"
      >
        <Box
          height={{ min: 'unset' }}
          flex="grow"
          background={{
            image: `url(${background})`,
            size: 'contain',
            position: 'bottom',
            repeat: 'no-repeat',
            attachment: 'fixed',
          }}
        >
          <Box pad={{ vertical: "large", horizontal: "35%" }}>
            <Heading level={1} textAlign="center" fill size="25px">
              Explore more #zoolife
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
  );
};

export default Plans;
