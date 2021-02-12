import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Box, Drop } from 'grommet';
import { formatDistanceToNow, startOfDay } from 'date-fns';
import classnames from 'classnames';

import Card from 'Components/Card';
import img2 from 'Components/ScheduleCarousel/img2.png';

import style from './style.scss';

const Event = ({
  event,
  label,
  style: { height, top } = {},
}) => {
  const eventRef = useRef();
  const [isRemindPopupOpen, setIsRemindPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsRemindPopupOpen(!isRemindPopupOpen);
  }

  return (
    <Box
      className={classnames('rbc-event', {
        [style.disabled]: event.start < startOfDay(new Date()),
        [style.normalEvent]: event.eventType === 'live',
        // TODO: we currently don't have support for this but it's in Figma
        [style.specialEvent]: event.eventType === 'special',
      })}
      ref={eventRef}
      style={{ top: `${top}%`, height: `${height}%` }}
      onClick={event.eventType !== 'live' ? togglePopup : undefined}
    >
      <div className={style.title} title={event.title}>
        {event.title}
      </div>
      <div className={classnames("rbc-event-label", style.label)} title={label}>
        {label}
      </div>
      {isRemindPopupOpen && (
        <Drop
          target={eventRef.current}
          align={{ right: 'right' }}
          onEsc={togglePopup}
          onClickOutside={togglePopup}
          className={style.drop}
        >
          <Card
            header={`STARTS IN ${formatDistanceToNow(event.start).toUpperCase()}`}
            description={event.title}
            // TODO: we currently don't have an image,
            //  so we are using this as a placeholder
            image={img2}
            onClick={() => console.log('Remind Me')}
          />
        </Drop>
      )}
    </Box>
  );
};

export default Event;
