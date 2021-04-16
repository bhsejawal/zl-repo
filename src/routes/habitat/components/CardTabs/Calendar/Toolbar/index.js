import { h } from 'preact';
import { Button } from 'grommet';
import { useContext, useMemo } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { addWeeks, startOfWeek } from 'date-fns';
import classnames from 'classnames';
import { connect} from 'react-redux';
import { PrimaryButton } from 'Components/Buttons';
import { hasPermission } from 'Components/Authorize';

import Context from '../Context';
import { showAddEventModal } from '../EventScheduleModals/actions';

import style from './style.scss';

const Toolbar = ({ date, label, showAddEventModalAction }) => {
  const { moveNext, movePrev, moveToToday } = useContext(Context);
  const rightArrowDisabled = useMemo(
    () => date > addWeeks(startOfWeek(new Date()), 3),
    [date],
  );
  const leftArrowDisabled = useMemo(() => startOfWeek(date) < new Date(), [date]);

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

      <div>
        <div>
          {
            hasPermission('habitat:edit-schedule')
              ? <PrimaryButton label="Add Event" size="medium" onClick={() => showAddEventModalAction(true)} />
              : (
                <>
                  <span className={style.circle} />
                  &nbsp;
                  <span>Stream Online</span>
                </>
              )
          }
        </div>
      </div>
    </div>
  );
};

export default connect(null, { showAddEventModalAction: showAddEventModal })(Toolbar);
