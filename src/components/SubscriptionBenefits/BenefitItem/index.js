import {
  Box,
  Text,
  Image,
} from 'grommet';

import { useIsMobileSize } from '../../../hooks';

const BenefitItem = ({ icon, text }) => {
  const isMobileSize = useIsMobileSize();
  const iconHeight = isMobileSize ? '20px' : '30px';

  return (
    <Box
      justify="center"
      align="center"
      width={{ max: '155px' }}
      flex="wrap"
    >
      <Image src={icon} style={{ height: iconHeight, maxHeight: iconHeight }} />
      <Box height={{ min: '75px'}}>
        <Text
          size="large"
          margin={{ top: '10px' }}
          responsive
          color="var(--mossLight)"
          textAlign="center"
        >
          {text}
        </Text>
      </Box>
    </Box>
  );
};

export default BenefitItem;
