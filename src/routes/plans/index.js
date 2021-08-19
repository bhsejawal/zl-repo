import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
  ResponsiveContext,
} from 'grommet';

import SubscriptionManager from 'Components/SubscriptionManager';
import SubscriptionBenefits from 'Components/SubscriptionBenefits';
import AnimalCollapsible from 'Components/AnimalCollapsible';

import { useIsMobileSize } from '../../hooks';

import mobilePlans from './assets/mobileImage.jpg';

import style from './style.module.scss';

const Plans = () => {
  const size = useContext(ResponsiveContext);
  const isMobileSize = useIsMobileSize();

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
      <Box
        height={{ min: 'unset' }}
        flex="grow"
      >
        {isMobileSize && (<img src={mobilePlans} alt="animals" />)}
        {!isMobileSize && (
          <Box
            fill="horizontal"
            height={{ min: 'max-content' }}
            alignSelf="center"
            pad={{ horizontal: ['xsmall', 'small'].includes(size) ? '35px' : '95px'}}
            background="#F9FCE7"
          >
            <Heading
              level={['xsmall', 'small'].includes(size) ? 3 : 2}
              textAlign="center"
              fill
              color="var(--charcoal)"
              margin={{ bottom: '0px' }}
            >
              Make a contribution to unlock all habitats.
            </Heading>
          </Box>
        )}
        <SubscriptionBenefits />
        <AnimalCollapsible />
        <SubscriptionManager />
      </Box>
    </Box>
  );
};

export default Plans;
