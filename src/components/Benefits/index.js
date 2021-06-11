import { Box, Grid } from 'grommet';

import messageBox from './assets/messageBox.svg';
import globe from './assets/globe.svg';
import binoculars from './assets/binoculars.svg';
import donate from './assets/donate.svg';

import BenefitItem from './BenefitItem';
import { useWindowResize } from '../../hooks';

const gridCalculator = (width) => {
  if (width <= 600) {
    return ['auto'];
  }
  if (width <= 768) {
    return ['auto', 'auto'];
  }
  return ['auto', 'auto', 'auto', 'auto'];
}

const ZoolifeBenefits = () => {
  const { width } = useWindowResize();

  return (
    <Box
      background="var(--hunterGreenMediumLight)"
      pad="medium"
      align="center"
      height={{ min: 'max-content' }}
    >
      <Grid
        columns={gridCalculator(width)}
        gap="large"
        pad={{ horizontal: '27px' }}
      >
        <BenefitItem
          text="24/7 access to 12 animal families around the world"
          icon={globe}
        />
        <BenefitItem
          text="Join live Q&amp;A&apos;s with zookeepers &amp; experts daily"
          icon={messageBox}
        />
        <BenefitItem
          text="Audience-controlled cameras to explore animals &amp; habitats and get up-close"
          icon={binoculars}
        />
        <BenefitItem
          text="50% of your purchase funds animal care &amp; conservation efforts"
          icon={donate}
        />
      </Grid>
    </Box>
  );
};

export default ZoolifeBenefits;
