import { h } from 'preact';
import { memo } from 'preact/compat';
import { Text } from 'grommet';

import style from './style.scss';

const Member = ({
  name,
  age,
  profileImg,
  onLoad,
}) => (
  <div className={style.member}>
    <div className={style.imageWrapper}>
      <div>
        <img
          className={style.profileImg}
          src={profileImg}
          alt={name}
          onLoad={onLoad}
        />
      </div>
    </div>

    <Text as="p" size="medium" margin="0 8px" className={style.text}>
      {name}
      {age ? `, ${age}` : ''}
    </Text>
  </div>
);

export default memo(Member);
