import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { memo } from 'preact/compat';

import style from './style.scss';

const getRandomColor = () => {
  const borderColors = [
    '--oceanBlue',
    '--blue',
    '--lightBlue',
    '--redDark',
    '--pink',
    '--lightPink',
    '--deepPink',
    '--brightPink',
    '--deepCoral',
    '--coral',
    '--deepYellow',
    '--yellow',
  ];

  return borderColors[Math.floor(Math.random() * borderColors.length)];
};

const getColor = (ind) => {
  const colors = [
    '--yellow',
    '--sage',
    '--lightBlue',
    '--pink',
    '--coral',
  ];

  return ind < colors.length ? colors[ind] : getRandomColor();
};

const Member = ({
  index,
  name,
  age,
  profileImg,
  onLoad,
}) => {
  const color = useMemo(() => getColor(index), [index]);

  return (
    <div className={style.member}>
      <img
        className={style.profileImg}
        src={profileImg}
        alt={name}
        style={{ borderColor: `var(${color})` }}
        onLoad={onLoad}
      />
      <p className={style.text}>
        {name}
        ,
        {' '}
        {age}
      </p>
    </div>
  );
};

export default memo(Member);
