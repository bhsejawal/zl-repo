import { Box, Grid, Text } from 'grommet';

import talk from './assets/talk.svg';
import elephant from './assets/elephant.svg';
import binoculars from './assets/binoculars.svg';

import BenefitItem from './BenefitItem';

import { useIsMobileSize } from '../../hooks';

const ZoolifeBenefits = () => {
  const isMobileSize = useIsMobileSize();
  return (
    <Box
      align="center"
      height={{ min: 'max-content' }}
      pad={{ top: isMobileSize ? '25px' : '30px' }}
      background="#F9FCE7"
    >
      <Box
        pad={{ horizontal: isMobileSize ? '35px' : '95px'}}
        margin={{ bottom: isMobileSize ? '20px' : '40px' }}
      >
        <Text
          size={isMobileSize ? 'large' : 'xlarge'}
          color="var(--charcoal)"
          textAlign="center"
          responsive
        >
          50% of your purchase directly funds conservation efforts led by our accredited partners.
        </Text>

      </Box>
      <Grid
        columns={['auto', 'auto', 'auto']}
        gap={isMobileSize ? 'medium' : 'large'}
        pad={{ horizontal: "20px"}}
      >
        <BenefitItem
          title="New animals"
          text="added every month"
          icon={elephant}
        />
        <BenefitItem
          title="Live Expert Talks "
          text="animal updates daily"
          icon={talk}
        />
        <BenefitItem
          title="Behind the scenes"
          text=" on any device, 24/7"
          icon={binoculars}
        />
      </Grid>
    </Box>
  );
};

export default ZoolifeBenefits;
