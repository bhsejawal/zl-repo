import { Box, Grid } from 'grommet';

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
      margin={{ top: '20px' }}
    >
      <Grid
        columns={['auto', 'auto', 'auto']}
        gap={isMobileSize ? 'xxsmall' : 'large'}
        pad={{ horizontal: "20px"}}
      >
        <BenefitItem
          text="New animals added every month"
          icon={elephant}
        />
        <BenefitItem
          text="Live expert talks &amp; animal updates daily"
          icon={talk}
        />
        <BenefitItem
          text="Go behind-the-scenes on any device, 24/7"
          icon={binoculars}
        />
      </Grid>
    </Box>
  );
};

export default ZoolifeBenefits;
