import { useContext } from 'preact/hooks';
import {
  Box,
  Heading,
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

  const gridSettings = isLargeScreen ? ['auto'] : ['auto', 'auto'];

  return (
    <Box
      background="#09474A"
      fill
      basis={isLargeScreen ? '1/4' : 'full'}
      pad={{ horizontal: "medium", vertical: isLargeScreen ? "large" : 'medium' }}
      align="center"
    >
      <Heading level="3" responsive>What you get:</Heading>
      <Grid
        columns={gridSettings}
        gap="medium"
        margin={{ top: '30px' }}
        style={{ maxWidth: isLargeScreen ? "380px" : null }}
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
