import { Box } from 'grommet';

import AvatarSection from './AvatarSection';
import FeatureSection from './FeatureSection';
import LiveTalksSection from './LiveTalksSection';

const Features = () => (
  <Box
    background={{
      image: 'url(https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_background.jpg)',
      size: 'cover',
      repeat: 'no-repeat',
      attachment: 'local',
      position: 'center top',
    }}
    gap="xlarge"
  >
    <AvatarSection />
    <FeatureSection />
    <LiveTalksSection />
  </Box>
);

export default Features;
