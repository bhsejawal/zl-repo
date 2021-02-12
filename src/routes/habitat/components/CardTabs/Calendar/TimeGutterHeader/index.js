import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Box } from 'grommet';

import Context from '../Context';

import style from './style.scss';

const TimeGutterHeader = ({ ...args }) => {
  const { monthYear } = useContext(Context);
  console.log(args)

  return (
    <Box justify="between" fill>
      <div>
        <span className={style.circle} />
        &nbsp;
        <span>Stream Online</span>
      </div>

      <div className={style.monthYear}>{monthYear}</div>
    </Box>
  );
};

export default TimeGutterHeader;
