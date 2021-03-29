import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { memo } from 'preact/compat';

import style from './style.scss';

const getRandomColor = () => {
  const borderColors = [
    '--blueMediumLight',
    '--coralLight',
    '--lavenderLight',
    '--mossLight',
    '--hunterGreenLight',
    '--blueMediumDark',
    '--purpleMedium',
    '--mossMedium',
    '--hunterGreenMediumLight',
    '--oliveMedium',
    '--blueLight',
    '--purpleLight',
    '--coralMedium',
    '--olive',
  ];

  return borderColors[Math.floor(Math.random() * borderColors.length)];
};

const getColor = (ind) => {
  const colors = [
    '--blueMediumLight',
    '--coralLight',
    '--lavenderLight',
    '--mossLight',
    '--hunterGreenLight',
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
      <div className={style.imageWrapper} style={{ borderColor: `var(${color})` }}>
        <div>
          <img
            className={style.profileImg}
            src={profileImg}
            alt={name}
            onLoad={onLoad}
          />
        </div>
      </div>

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
