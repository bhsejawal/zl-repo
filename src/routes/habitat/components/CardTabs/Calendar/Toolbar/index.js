import { h } from 'preact';
import { Button } from 'grommet';
import { useContext, useMemo } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { addWeeks, startOfDay, startOfWeek } from 'date-fns';
import classnames from 'classnames';

import Context from '../Context';
import { useIsMobileSize } from '../../../../../../hooks';

import style from './style.scss';

const Toolbar = ({ date, label }) => {
  const { moveNext, movePrev, moveToToday } = useContext(Context);
  const rightArrowDisabled = useMemo(
    () => date > addWeeks(startOfWeek(new Date()), 3),
    [date],
  );
  const isMoblieSize = useIsMobileSize();
  const leftArrowDisabled = useMemo(
    () => (isMoblieSize
      ? startOfDay(date) < new Date()
      : startOfWeek(date) < new Date()),
    [date, isMoblieSize],
  );

  return (
    <div className={style.toolbar}>
      <div>
        <Button label="Today" onClick={moveToToday} />

        <FontAwesomeIcon
          className={classnames(style.leftArrow, {
            [style.disabled]: leftArrowDisabled,
          })}
          icon={faChevronLeft}
          size="lg"
          onClick={movePrev}
        />
        <FontAwesomeIcon
          className={classnames(style.rightArrow, {
            [style.disabled]: rightArrowDisabled,
          })}
          icon={faChevronRight}
          size="lg"
          onClick={moveNext}
        />

        <span>{label}</span>
      </div>
    </div>
  );
};

export default Toolbar;
