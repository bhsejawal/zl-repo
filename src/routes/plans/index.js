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
        style={{ paddingTop: '60px' }}
        fill={isLargeScreen}
        responsive
        background={{
          image: `url(${background})`,
          size: 'contain',
          position: 'bottom',
          repeat: 'no-repeat',
          attachment: 'fixed',
        }}
        pad={{ horizontal: !isLargeScreen ? 'xlarge' : 'none' }}
      >
        <Heading level={1} textAlign="center" fill>
          Select a Plan
        </Heading>
        <Text textAlign="center" margin={{ bottom: 'xxsmall' }}>
          Become part of the ZooLife Family!
        </Text>
        <Text textAlign="center">
          50% of our proceeds go to the conservation zoos.
        </Text>
        <Box
          direction={['xsmall', 'small'].includes(size) ? 'column' : 'row'}
          fill justify="center"
          gap={size === 'medium' ? 'medium' : 'large'}
          margin={{top: 'large', bottom: 'large' }}
          pad={{ top: !isLargeScreen ? 'small' : 'none', bottom: 'xlarge' }}
        >
          {plans.map(({
            planName,
            planPrice,
            planType,
            color,
            benefits,
            planId,
          }) => (
            <PlanCard
              key={planId}
              planName={planName}
              planPrice={planPrice}
              planType={planType}
              color={color}
              benefits={benefits}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default connect(({ plans: { plans } }) => ({ plans }))(Plans);
