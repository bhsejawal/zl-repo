import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';

import { connect } from 'react-redux';

import PlanCard from 'Components/PlanCard';
import Header from 'Components/Header';

import background from 'Assets/plansBackground.png';

import ZoolifeBenefits from './benefitsSection';

const Plans = ({ plans }) => {
  const size = useContext(ResponsiveContext);
  const isLargeScreen = size === 'large';

  if (!plans) {
    return null;
  }

  return (
    <>
      <Header />
      <Box
        margin={{ top: '60px' }}
        fill={['medium', 'large'].includes(size)}
        responsive
        direction={ isLargeScreen ? 'row' : 'column' }
      >
        <Box
          fill
          basis={isLargeScreen ? '3/4' : 'full'}
          background={{
            image: `url(${background})`,
            size: 'contain',
            position: 'bottom',
            repeat: 'no-repeat',
            attachment: 'fixed',
          }}
        >
          <Box pad={{ vertical: "large", horizontal: "15%" }}>
            <Heading level={1} textAlign="center" fill>
              Explore more #zoolife
            </Heading>
            <Text textAlign="center">
              50% of your ticket directly funds conservation
              &amp; animal care efforts led by our AZA-accredited partners.
            </Text>
          </Box>
          <Box
            direction={['medium', 'large'].includes(size) ? 'row' : 'column'}
            fill
            align="center"
            justify="center"
            gap="large"
            margin={{top: 'small', bottom: 'medium' }}
            pad={{ top: !isLargeScreen ? 'small' : 'none' }}
          >
            {plans.map(({
              planName,
              planPrice,
              planType,
              color,
              benefits,
              planId,
              planCurrency,
              amountOff,
            }) => (
              <PlanCard
                key={planId}
                planName={planName}
                planPrice={planPrice}
                planType={planType}
                planCurrency={planCurrency}
                color={color}
                benefits={benefits}
                amountOff={amountOff}
              />
            ))}
          </Box>
        </Box>
        <ZoolifeBenefits />
      </Box>
    </>
  );
};

export default connect(({ plans: { plans } }) => ({ plans }))(Plans);
