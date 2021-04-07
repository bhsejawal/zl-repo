import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import {
  Box,
  ResponsiveContext,
  Heading,
  Text,
} from 'grommet';
import { LandingSecondary } from 'Components/Buttons';

const LiveTalksSection = () => {
  const size = useContext(ResponsiveContext);
  const direction = ['xsmall', 'small', 'medium'].includes(size) ? 'column' : 'row';

  return (
    <Box
      direction={direction}
      pad={{ horizontal: direction === 'column' ? 'large' : 'xlarge', vertical: 'medium' }}
    >
      <Box
        basis="1/2"
      >
        <Box
          width={{ max: direction === "row" ? '650px' : ''} }
          pad={ direction === 'column' ? 'large' : 'medium' }
          justify="start"
          alignSelf="start"
        >
          <video
            autoPlay
            loop
            muted
            playInline
            src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_host.mp4"
            style={{
              maxWidth: direction === "row" ? "450px" : "100%",
              zIndex: 1,
              borderRadius: '2px',
            }}
          />

        </Box>
      </Box>
      <Box
        basis="1/2"
        margin={{ top: direction === 'column' ? 'medium' : ''}}
      >
        <Box
          pad={{ horizontal: direction === 'column' ? 'large' : 'xlarge'}}
        >
          <Heading textAlign="start" level="2">
            Take part in engaging conversations with the experts
          </Heading>
          <Text textAlign="start" size="18px">
            Join daily keeper talks and interactive Q&amp;As with animal experts and naturalists.
          </Text>
          <Box alignSelf="start" margin={{ vertical: 'xlarge' }}>
            <LandingSecondary onClick={() => route('/signup')}>Join a Live Q&amp;A</LandingSecondary>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveTalksSection;
