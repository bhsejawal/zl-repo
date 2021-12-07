import { h } from 'preact';
import { Box, Heading } from 'grommet';
import { forwardRef } from 'preact/compat';

import ImageSelector from 'Components/ImageSelector';

const Trailer = forwardRef(({ videoURL, setVideoURL }, ref) => (
  <Box margin={{ bottom: '20px' }}>
    <Heading margin={{ top: '0', bottom: '5px' }} level="5">Habitat Trailer</Heading>
    <ImageSelector
      url={videoURL}
      ref={ref}
      placeholder="https://"
      constraints={{
        acceptedFormats: ['mp4'],
        maxFileSize: 12_000_000,
      }}
      onChange={(value) => setVideoURL(value)}
    />
  </Box>
));

export default Trailer;
