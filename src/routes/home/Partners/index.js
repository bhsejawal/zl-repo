import { useContext } from 'preact/hooks';

import {
  Box,
  Heading,
  Grid,
  Image,
  ResponsiveContext,
} from 'grommet';

const partnersImages = [
  'https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_pacific.png',
  'https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_toronto_zoo.png',
  'https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_orana.png',
  'https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_coming_soon.png',
];

const Partners = () => {
  const size = useContext(ResponsiveContext);
  const partnerImageSize = size === 'xsmall' ? '132px' : '174px';
  return (
    <Box
      height={{min: '604px'}}
      justify="center"
      background={{image: 'url(https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_bg.png)'}}
    >
      <Box alignSelf="center" width={{max: '700px'}}>
        <Heading textAlign="center" level="2" margin="18px">
          Live 24/7 from accredited zoos, animal sanctuaries and
          rehabilitation centers worldwide.
        </Heading>
      </Box>
      <Box align="center" margin={{ top: 'medium' }}>
        <Grid
          columns={ ['xsmall', 'small', 'medium'].includes(size) ? ['auto', 'auto'] : ['auto', 'auto', 'auto', 'auto']}
          gap="40px"
          margin="small"
        >
          {partnersImages.map((image) => (
            <Box
              background="white"
              pad="medium"
              width={partnerImageSize}
              height={partnerImageSize}
              alignContent="center"
              justify="center"
            >
              <Image src={image} />
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Partners;
