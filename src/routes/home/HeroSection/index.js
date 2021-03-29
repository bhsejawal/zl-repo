import { route } from 'preact-router';
import { useContext } from 'preact/hooks';
import {
  ResponsiveContext,
  Box,
  Heading,
} from 'grommet';

import { PrimaryButton } from 'Components/Buttons';

const HeroSection = () => {
  const size = useContext(ResponsiveContext);
  const direction = ['xsmall', 'small', 'medium'].includes(size) ? 'column' : 'row';

  return (
    <>
      <Box direction={direction} background={{color: '#9BB7F1'}} flex="grow" width={{ max: '100vw'}}>
        <Box justify="center" alignContent="center" pad="30px" basis="1/2">
          <Heading textAlign="center" level="1">Explore nature, from home.</Heading>
          <Heading textAlign="center" level="4">
            Incredible animal experiences from the world&apos;s
            top zoos, hosted by nature experts.
          </Heading>
          <Box alignSelf="center">
            <PrimaryButton
              size="large"
              label="Meet the Animals"
              type="button"
              onClick={() => route('/signup')}
            />
          </Box>
        </Box>
        <Box basis="1/2" justify="center" alignContent="center">
          <video autoPlay muted loop controls={false} >
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.webm" type="video/webm" />
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.mov" type="video/mov" />
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>
      <Box background="linear-gradient(180deg, #FFDCEE 0%, #FEDFD0 100%)" pad={{ horizontal: '10%' }}>
        <Heading textAlign="center" level="4" margin="medium">50% of your purchase funds animal care &amp; conservation.</Heading>
      </Box>
    </>
  );
};

export default HeroSection;
