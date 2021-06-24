import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { Box, Drop } from 'grommet';
import { formatDistanceToNow } from 'date-fns';

import classnames from 'classnames';
import Card from 'Components/Card';
import EditButton from 'Components/AdminEditWrappers/EditButton';
import { hasPermission } from 'Components/Authorize';

import { useIsMobileSize } from '../../../../../../hooks';
import { showEditEventModal } from '../EventScheduleModals/actions';

import style from './style.scss';

const Event = ({
  event,
  label,
  profileImage,
  style: { height, top } = {},
  showEditEventModalAction,
}) => {
  const eventRef = useRef();
  const [isRemindPopupOpen, setIsRemindPopupOpen] = useState(false);
  const isMobileSize = useIsMobileSize();

  const togglePopup = () => {
    setIsRemindPopupOpen(!isRemindPopupOpen);
  }

  return (
    <Box
      className={classnames('rbc-event', {
        [style.disabled]: event.start < new Date(),
        [style.normalEvent]: event.eventType === 'live',
        // TODO: we currently don't have support for this but it's in Figma
        [style.specialEvent]: event.eventType === 'special',
        [style.editable]: hasPermission('habitat:edit-schedule') && event.end > new Date(),
      })}
      ref={eventRef}
      style={{ top: `${top}%`, height: `${height}%` }}
      onClick={event.eventType !== 'live' || hasPermission('habitat:edit-schedule') ? togglePopup : undefined}
    >
      <div className={style.title} title={event.title}>
        {event.title}
      </div>
      {event.eventType === 'live' && (
        <div className={classnames("rbc-event-label", style.label)} title={label}>
          {label}
        </div>
      )}
      {isRemindPopupOpen && (
        <Drop
          target={eventRef.current}
          align={{ right: 'right' }}
          onEsc={togglePopup}
          onClickOutside={togglePopup}
          className={style.drop}
        >
          {hasPermission('habitat:edit-schedule') && !isMobileSize && (
            <EditButton onClick={() => showEditEventModalAction(true, event)} />
          )}
          <Card
            header={new Date() >= event.start && new Date() <= event.end ? 'THIS EVENT IS LIVE' : `STARTS IN ${formatDistanceToNow(event.start).toUpperCase()}`}
            description={event.title}
            image={profileImage}
            scheduleId={event._id}
            title={event.title}
          />
        </Drop>
      )}
    </Box>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { profileImage } } }) => ({ profileImage }),
  { showEditEventModalAction: showEditEventModal },
)(Event);
