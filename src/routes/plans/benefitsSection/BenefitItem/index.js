import {
  Box,
  Text,
  Image,
} from 'grommet';

const BenefitItem = ({ icon, text }) => (
  <Box
    direction="row"
    margin={{ bottom: '30px'}}
    justify="center"
    align="center"
  >
    <Image src={icon} style={{ width: '28px', maxHeight: '28px' }} />
    <Text margin={{ left: 'medium' }} responsive size="medium">
      {text}
    </Text>
  </Box>
);

export default BenefitItem;
