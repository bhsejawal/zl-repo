import { connect } from 'react-redux';
import {
  Anchor,
  Box,
  Heading,
  Text,
} from 'grommet';

import { openContactUsModal } from 'Components/modals/ContactUs/actions';
import Loader from 'Components/Loader';

const LoadingContent = ({ openContactUsModalAction }) => (
  <Box justify="center" align="center" margin="auto">
    <Loader height="120px" />
    <Heading level="3" margin={{ top: '30px' }}>Hang on, we’re generating your moment...</Heading>
    <Text color="black" margin={{ top: 'large', bottom: '20px' }} size="large">
      Not loading?&nbsp;
      <Anchor onClick={openContactUsModalAction}>Contact Us</Anchor>
    </Text>
  </Box>
);

export default connect(
  null,
  { openContactUsModalAction: openContactUsModal },
)(LoadingContent);
