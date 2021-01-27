import { Box } from 'grommet';
import SocialLoginButton from '../../components/SocialLoginButton';

const Signup = () => (
  <Box margin={{ top: 'xlarge' }} direction="row" gap="small">
    <SocialLoginButton variant="facebook" />
    <SocialLoginButton variant="google" />
  </Box>
);

export default Signup;
