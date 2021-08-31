import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
  ResponsiveContext,
} from 'grommet';

import SubscriptionManager from 'Components/SubscriptionManager';
import SubscriptionBenefits from 'Components/SubscriptionBenefits';
import AnimalCollapsible from 'Components/AnimalCollapsible';

import Header from '../home/Header';

import { useIsMobileSize } from '../../hooks';

import mobilePlans from './assets/mobileImage.jpg';

import style from './style.module.scss';

const Plans = () => {
  const size = useContext(ResponsiveContext);
  const isMobileSize = useIsMobileSize();

  return (
    <div className={style.pricesPage}>
      <Header />
      <Box
      responsive
      height={{ min: '100%' }}
      direction="column"
      overflow="auto"
      background="var(--hunterGreenMediumLight)"
      className={style.content}
    >
        {isMobileSize && (<img src={mobilePlans} alt="animals" />)}
        {!isMobileSize && (
          <Box
            fill="horizontal"
            height={{ min: 'max-content' }}
            pad={{ top: '20px' }}
            alignSelf="center"
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
        <SubscriptionManager showFreemium isPublicPage />
      </Box>
    </div>
  );
};

export default Plans;
