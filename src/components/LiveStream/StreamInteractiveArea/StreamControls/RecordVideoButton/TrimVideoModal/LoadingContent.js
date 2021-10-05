import { connect } from 'react-redux';
import {
  Anchor,
  Box,
  Heading,
  Text,
} from 'grommet';

import { openContactUsModal } from 'Components/modals/ContactUs/actions';
import Loader from 'Components/Loader';
import { useIsMobileSize } from '../../../../../../hooks';

const LoadingContent = ({ openContactUsModalAction }) => {
  const isMobile = useIsMobileSize();
  return (
    <Box justify="center" align="center" margin="auto">
      <Loader height="120px" />
      <Heading
        level="2"
        margin="32px"
        textAlign="center"
      >
        Hang on, we’re generating your moment...
      </Heading>
      <Text color="black" margin={{ top: isMobile ? '0px' : 'large', bottom: '20px' }} size="large">
        Not loading?&nbsp;
        <Anchor onClick={openContactUsModalAction}>Contact Us</Anchor>
      </Text>
    </Box>
  );
};

export default connect(
  null,
  { openContactUsModalAction: openContactUsModal },
)(LoadingContent);
