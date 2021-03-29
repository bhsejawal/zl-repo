import { useContext } from 'preact/hooks';
import {
  Box,
  ResponsiveContext,
  Grid,
} from 'grommet';

import messageBox from './assets/messageBox.svg';
import learning from './assets/learning.svg';
import globe from './assets/globe.svg';
import camera from './assets/camera.svg';

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
      height={{ min: 'unset' }}
    >
      <Grid
        columns={gridSettings}
        gap="large"
        pad={{ horizontal: 'medium' }}
      >
        <BenefitItem
          text="Live Zookeeper Q&amp;As every hour, every day"
          icon={messageBox}
        />
        <BenefitItem
          text="Audience-controlled cameras to explore habitats and get up-close"
          icon={learning}
        />
        <BenefitItem
          text="Access to 12 live animal families around the world"
          icon={globe}
        />
        <BenefitItem
          text="Interactive learning content to spark your nature knowledge"
          icon={camera}
        />
      </Grid>
    </Box>
  );
};

export default ZoolifeBenefits;
