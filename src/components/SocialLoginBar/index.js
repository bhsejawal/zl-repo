import { h } from 'preact';
import { Grid } from 'grommet';

import SocialLoginButton from './SocialLoginButton';

const SocialLoginBar = () => (
  <Grid
    columns={['auto', 'auto']}
    gap="xsmall"
    width="100%"
  >
    <SocialLoginButton variant="facebook" />
    <SocialLoginButton variant="google" />
  </Grid>
);

export default SocialLoginBar;
