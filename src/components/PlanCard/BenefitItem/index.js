import {
  Text,
  Box,
} from 'grommet';

import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './style.module.scss';

const BenefitItem = ({ benefit }) => (
  <Box>
    <Text
      margin={{ top: '10px' }}
      style={{ fontSize: '13px', lineHeight: "18px" }}
    >
      <FontAwesomeIcon icon={faCheck} className={style.benefitIcon} />
      {benefit}
    </Text>
  </Box>
);

export default BenefitItem;
