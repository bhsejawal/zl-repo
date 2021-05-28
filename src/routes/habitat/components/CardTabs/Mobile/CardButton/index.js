import { h } from 'preact';
import { Box, Button, Text } from 'grommet';

import style from './style.scss';

const CardButton = ({
  icon,
  color,
  label,
  onClick,
}) => (
  <Button plain className={style.btn} onClick={onClick}>
    <Box
      elevation="small"
      round="small"
      width="100px"
      height="100px"
      justify="center"
      align="center"
      overflow={{ horizontal: 'auto' }}
      background={color}
    >
      {icon}
    </Box>

    <Box margin={{ top: 'medium' }} align="center">
      <Text size="xlarge">{label}</Text>
    </Box>
  </Button>
);

export default CardButton;
