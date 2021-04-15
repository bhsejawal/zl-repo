import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import {
  Box,
  ResponsiveContext,
  Heading,
  Image,
  Text,
} from 'grommet';
import { LandingSecondary } from 'Components/Buttons';

const AvatarSection = () => {
  const size = useContext(ResponsiveContext);
  const direction = ['xsmall', 'small', 'medium'].includes(size) ? 'column' : 'row';

  return (
    <Box
      direction={direction}
      pad={{ horizontal: direction === 'column' ? 'large' : 'xlarge', vertical: 'medium' }}
    >
      <Box basis="1/2" justify="center" alignContent="center">
        <Box
          width={{ max: '340px', min: '200px' }}
          alignSelf="center"
          pad={{ horizontal: direction === 'row' ? 'medium' : 'xlarge', vertical: 'medium' }}
        >
          <Image src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_animal_grid.png" />
        </Box>
      </Box>
      <Box
        justify="center"
        alignContent="center"
        basis="1/2"
      >
        <Box pad={{ horizontal: direction === 'column' ? 'large' : 'xlarge'}}>
          <Heading textAlign="start" level="2">
            Meet dozens of your favorite animals, from home.
          </Heading>
          <Text textAlign="start" size="18px">
            Explore the secret life of remarkable animals from around the globe.
          </Text>
          <Box alignSelf="start" margin={{ top: '50px' }}>
            <LandingSecondary onClick={() => route('/signup')}>Meet the Animals</LandingSecondary>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AvatarSection;
