import classnames from 'classnames';
import { Text } from 'grommet';

import style from './style.scss';

const Tag = ({
  label,
  varient, // online, light, offline
}) => (
  <Text size="small" weight="700" className={classnames(style.tag, style[varient])}>
    {label}
  </Text>
);

export default Tag;
