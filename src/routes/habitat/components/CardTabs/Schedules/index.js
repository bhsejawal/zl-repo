import { connect } from 'react-redux';
import { useState, useEffect } from 'preact/hooks';

import { hasPermission } from 'Components/Authorize';
import { PrimaryButton } from 'Components/Buttons';
import AddEventModal from '../Calendar/EventScheduleModals/AddEvent';
import { showAddEventModal } from '../Calendar/EventScheduleModals/actions';
import DatePicker from './DatePicker';
import StreamTimes from './StreamTimes';
import LiveTalks from './LiveTalks';
import style from './style.scss';

const SchedulesTab = ({ habitatId, showAddEventModalAction }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setDate(new Date());
  }, [habitatId]);

  const onChange = (value) => {
    setDate(value);
  }

  return (
    <div className={style.schedulesTabContainer}>
      <div className={style.header}>
        <h3>Schedule</h3>
        <DatePicker date={date} onChange={onChange} />
        {hasPermission('habitat:edit-schedule') && (
          <PrimaryButton label="Add Event" size="medium" onClick={() => showAddEventModalAction(true)} />
        )}
      </div>

      <div className={style.contentWrapper}>
        <LiveTalks date={date} />
        <StreamTimes date={date} />
        <div className={style.fallback}>
          <h3>No talks or streams on this day</h3>
        </div>
      </div>

      <AddEventModal />
    </div>
  )
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
  { showAddEventModalAction: showAddEventModal },
)(SchedulesTab);
