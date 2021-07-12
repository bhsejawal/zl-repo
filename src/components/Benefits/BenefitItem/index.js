import {
  Box,
  Text,
  Image,
} from 'grommet';

const BenefitItem = ({ icon, text }) => (
  <Box
    direction="row"
    justify="center"
    align="center"
  >
    <Image src={icon} style={{ width: '28px', maxHeight: '28px' }} />
    <Box flex="grow" fill justify="center">
      <Text size="xlarge" margin={{ left: 'medium' }} responsive color="white">
        {text}
      </Text>
    </Box>
  </Box>
);

export default BenefitItem;
