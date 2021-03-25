import {
  Text,
  Box,
} from 'grommet';

const BenefitItem = ({ benefit }) => (
  <Box>
    <Text
      margin={{ top: '10px' }}
      weight="bold"
      size="16px"
      style={{ fontSize: '16px', lineHeight: "18px" }}
    >
      {benefit}
    </Text>
  </Box>
);

export default BenefitItem;
