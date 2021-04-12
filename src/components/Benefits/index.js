import { useContext } from 'preact/hooks';
import {
  Box,
  ResponsiveContext,
  Grid,
} from 'grommet';

import messageBox from './assets/messageBox.svg';
import globe from './assets/globe.svg';
import binoculars from './assets/binoculars.svg';
import donate from './assets/donate.svg';

import BenefitItem from './BenefitItem';

const ZoolifeBenefits = () => {
  const size = useContext(ResponsiveContext);
  const isLargeScreen = size === 'large';

  const gridSettings = isLargeScreen ? ['auto', 'auto', 'auto', 'auto'] : ['auto', 'auto'];

  return (
    <Box
      background="var(--hunterGreenMediumLight)"
      pad="medium"
      align="center"
      height={{ min: '90px' }}
    >
      <Grid
        columns={gridSettings}
        gap="large"
        pad={{ horizontal: 'medium' }}
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
