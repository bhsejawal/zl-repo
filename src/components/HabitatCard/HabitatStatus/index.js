import { h } from 'preact';
import { Text } from 'grommet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import Tag from 'Components/Tag';

import style from './style.scss';

const HabitatStatus = ({
  online,
  liveTalk,
  free,
  className,
}) => {
  let label = '';
  if (free) {
    label = 'FREE';
  } else {
    label = online ? 'ONLINE' : 'OFFLINE';
    if (online && liveTalk) {
      label = 'LIVE TALK';
    }
  }

  const tagLabel = (
    <span>
      {(online || liveTalk) && <FontAwesomeIcon icon={faCircle} />}
      <Text size="small" weight={700} style={{ lineHeight: '15px'}}>
        {label}
      </Text>
    </span>
  );

  return (
    <div className={classnames(style.tag, className)}>
      <Tag
        label={tagLabel}
        varient={online && liveTalk ? 'liveTalk' : label.toLowerCase()}
      />
    </div>
  )
};

export default HabitatStatus;
