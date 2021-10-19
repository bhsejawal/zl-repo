import { connect } from 'react-redux';
import { useState, useEffect } from 'preact/hooks';

import { hasPermission } from 'Components/Authorize';
import { PrimaryButton } from 'Components/Buttons';
import AddEventModal from 'Components/ScheduleEvents/EventScheduleModals/AddEvent';
import EditEventModal from 'Components/ScheduleEvents/EventScheduleModals/EditEvent';
import DeleteEventModal from 'Components/ScheduleEvents/EventScheduleModals/DeleteEvent';
import { showAddEventModal } from 'Components/ScheduleEvents/actions';
import DatePicker from './DatePicker';
import LiveStreams from './LiveStreams';
import LiveTalks from './LiveTalks';
import style from './style.scss';

const SchedulesTab = ({ habitatId, showAddEventModalAction }) => {
  const [date, setDate] = useState();

  useEffect(() => {
    setDate(new Date());
  }, [habitatId]);

  const onChange = (value) => {
    setDate(value);
  }

  const updateHandler = () => {
    // updating date and reverting it will refresh children component
    setDate(null);
    setTimeout(() => setDate(date), 1);
  };

  if (!date) {
    return null;
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
        <LiveStreams date={date} />
        <div className={style.fallback}>
          <h3>No talks or streams on this day</h3>
        </div>
      </div>

      <AddEventModal onUpdate={updateHandler} />
      <EditEventModal onUpdate={updateHandler} />
      <DeleteEventModal onUpdate={updateHandler} />
    </div>
  )
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
  { showAddEventModalAction: showAddEventModal },
)(SchedulesTab);
