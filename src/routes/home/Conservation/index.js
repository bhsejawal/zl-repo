import { route } from 'preact-router';
import { useContext } from 'preact/hooks';
import {
  ResponsiveContext,
  Box,
  Heading,
  Image,
  Text,
} from 'grommet';

import { PrimaryButton } from 'Components/Buttons';

const HeroSection = () => {
  const size = useContext(ResponsiveContext);
  const direction = ['xsmall', 'small', 'medium'].includes(size) ? 'column' : 'row';

  return (
    <Box direction={direction} background={{color: '#24412B'}} flex="grow" width={{ max: '100vw'}}>
      <Box
        justify="center"
        alignContent="center"
        basis="1/2"
        pad={{ horizontal: '10%', vertical: direction === 'row' ? '0%' : '10%' }}>
        <Heading textAlign="start" level="2">
          Support the conservation movement with your purchase.
        </Heading>
        <Text textAlign="start" size="18px">
          {`
            50% of your purchase directly funds animal care & conservation efforts led by our partners.
          `}
        </Text>
        <Box alignSelf="start" margin={{ top: '50px' }}>
          <PrimaryButton
            size="large"
            label="I want to help"
            type="button"
            onClick={() => route('/signup')}
          />
        </Box>
      </Box>
      <Box basis="1/2" justify="center" alignContent="center">
        <Image src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s5_koalas.png" />
      </Box>
    </Box>
  );
};

export default HeroSection;
