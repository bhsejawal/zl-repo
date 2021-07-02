import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';

import { faGripLinesVertical } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style.scss';

export const getTimeString = (seconds) => {
  const date = new Date(null);
  date.setHours(0);
  date.setMinutes(0)
  date.setSeconds(seconds);
  return date.toTimeString().slice(0, 8);
};

export const customEdge = deepMerge(grommet, {
  rangeSelector: {
    edge: {
      type: (
        <div className={style.edge}>
          <FontAwesomeIcon icon={faGripLinesVertical} />
        </div>
      ),
    },
  },
});
