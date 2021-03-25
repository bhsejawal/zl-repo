import { h } from 'preact';
import { Box } from 'grommet';

import SocialLoginButton from './SocialLoginButton';

const SocialLoginBar = () => (
  <Box direction="row" gap="medium">
    <SocialLoginButton variant="facebook" />
    <SocialLoginButton variant="google" />
  </Box>
);

export default SocialLoginBar;
