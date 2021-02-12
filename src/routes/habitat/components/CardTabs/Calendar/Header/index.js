import { h } from 'preact';
import { useContext, useMemo } from 'preact/hooks';
import {
  addWeeks,
  isSaturday,
  isSunday,
  isToday,
  startOfDay,
} from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import Context from '../Context';

import style from './style.scss';

const Header = ({ date, localizer }) => {
  const { moveNext, movePrev } = useContext(Context);
  const hasLeftArrow = useMemo(() => isSunday(date), [date]);
  const hasRightArrow = useMemo(() => isSaturday(date), [date]);
  const isRightArrowDisabled = useMemo(() => (
    hasRightArrow && date > addWeeks(new Date(), 3)
  ), [date, hasRightArrow]);

  return (
    <div
      className={classnames(style.headerItem, {
        [style.disabled]: date < startOfDay(new Date()),
        [style.today]: isToday(date),
      })}
    >
      {hasLeftArrow && (
        <FontAwesomeIcon
          className={style.leftArrow}
          icon={faChevronLeft}
          size="2x"
          onClick={movePrev}
        />
      )}

      {hasRightArrow && (
        <FontAwesomeIcon
          className={classnames(style.rightArrow, {
            [style.disabled]: isRightArrowDisabled,
          })}
          icon={faChevronRight}
          size="2x"
          onClick={moveNext}
        />
      )}

      <p>{localizer.format(date, 'EEE')}</p>
      <h4 className={style.number}>{localizer.format(date, 'd')}</h4>
    </div>
  );
};

export default Header;
