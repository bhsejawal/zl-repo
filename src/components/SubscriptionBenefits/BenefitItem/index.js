import {
  Box,
  Text,
  Image,
} from 'grommet';

import { useIsMobileSize } from '../../../hooks';

const BenefitItem = ({ icon, title, text }) => {
  const isMobileSize = useIsMobileSize();
  const iconHeight = isMobileSize ? '22px' : '30px';

  return (
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
        <Image src={icon} style={{ height: iconHeight, maxHeight: iconHeight, stroke: 'white' }} />
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
};

export default BenefitItem;
