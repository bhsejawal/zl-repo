import { h } from 'preact';
import { route } from 'preact-router';
import { useContext } from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Image,
  ResponsiveContext,
} from 'grommet';

import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import background from './errorBackground.webp';

const ErrorPage = ({
  error,
  message,
  userId,
  url,
}) => {
  const size = useContext(ResponsiveContext);

  const sendEmail = () => {
    const subject = `${userId ? `ref: ${userId} - ` : ''}Error ${error}: ${url}`
    const mailto = `mailto:${process.env.PREACT_APP_SUPPORT_EMAIL}?subject=${subject}`;
    window.open(mailto, '_blank', 'noopener');
  };

  return (
    <Box
      fill
      className="errorGradient"
    >
      <Box justify="center" align="center" margin={{ top: 'medium' }} basis="2/3" pad="large">
        <Box>
          <Text size="100px" color="#3B499C" weight={700} textAlign="center">{error}</Text>
          <Heading level="2" textAlign="center">{message}</Heading>
        </Box>
        <Box direction={size === 'xsmall' ? 'column' : 'row'} justify="center" gap="medium" margin={{ top: 'medium' }}>
          <PrimaryButton
            size="large"
            label="Back to Zoolife"
            onClick={() => route('/', true)}
          />
          <OutlineButton
            size="large"
            label="Contact Us"
            onClick={sendEmail}
          />

        </Box>
      </Box>
      <Box justify="end" fill basis="1/2">
        <Image src={background} fit="cover" />
      </Box>
    </Box>
  );
};

export default connect(({ user: { userId }}) => ({ userId }))(ErrorPage);
