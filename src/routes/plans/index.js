import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';
import SubscriptionManager from 'Components/SubscriptionManager';

import SubscriptionBenefits from 'Components/SubscriptionBenefits';

import backgroundDesktop from './assets/backgroundDesktop.png';
import backgroundMobile from './assets/backgroundMobile.png';
import backgroundTablet from './assets/backgroundTablet.png';

import style from './style.module.scss';

const getBackgroundByScreenSize = (size) => {
  if (['xsmall', 'small'].includes(size)) {
    return backgroundMobile;
  }
  if (size === 'medium') {
    return backgroundTablet;
  }

  return backgroundDesktop;
}

const Plans = () => {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      height="100%"
      responsive
      direction="column"
      fill={['medium', 'large'].includes(size)}
      overflow="auto"
      background="var(--hunterGreenMediumLight)"
      className={style.plansPageWrapper}
    >
      <img src={getBackgroundByScreenSize(size)} className={style.bottomImage} alt="Map Top" />
      <Box
        height={{ min: 'unset' }}
        flex="grow"
      >
        <Box
          width={{ max: '930px' }}
          height={{ min: 'max-content' }}
          alignSelf="center"
          pad={{ horizontal: ['xsmall', 'small'].includes(size) ? '35px' : '95px'}}
        >
          <Heading
            level={['xsmall', 'small'].includes(size) ? 3 : 2}
            textAlign="center"
            fill
            color="white"
          >
            Make a contribution to continue exploring Zoolife.
          </Heading>
          <Text textAlign="center" size="xlarge" color="white" weight={700} margin={{ bottom: '30px' }}>
            {/* eslint-disable-next-line max-len */}
            50% of your purchase directly funds essential animal care &amp; conservation efforts led by our AZA-accredited partners around the world.
          </Text>
        </Box>
        <SubscriptionBenefits />
        <SubscriptionManager />
      </Box>
    </Box>
  );
};

export default Plans;
