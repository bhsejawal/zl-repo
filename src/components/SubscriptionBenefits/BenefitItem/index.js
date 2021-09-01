import {
  Box,
  Text,
  Image,
} from 'grommet';

const BenefitItem = ({ icon, title, text }) => (
  <Box
    justify="center"
    align="center"
    width={{ max: '155px' }}
    flex="wrap"
  >
    <Box
      background="#CBDFA6"
      width="50px"
      height="50px"
      align="center"
      justify="center"
      style={{ borderRadius: '5px'}}
    >
      <Image src={icon} style={{ height: '22px', maxHeight: '22px' }} />
    </Box>
    <Box>
      <Text
        size="small"
        margin={{ top: '10px' }}
        responsive
        color="var(--charcoal)"
        textAlign="center"
        weight="bold"
      >
        {title}
      </Text>
      <Text
        size="small"
        responsive
        color="var(--charcoal)"
        textAlign="center"
      >
        {text}
      </Text>
    </Box>
  </Box>
);

export default BenefitItem;
