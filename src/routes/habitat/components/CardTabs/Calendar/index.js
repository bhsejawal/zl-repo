import { h } from 'preact';
import { Calendar as BigCalendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import { useCallback, useMemo, useState } from 'preact/hooks';
import locale from 'date-fns/locale/en-US';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns';

import Event from './Event';
import Toolbar from './Toolbar';

import Context from './Context';
import AddEventModal from './EventScheduleModals/AddEvent';
import EditEventModal from './EventScheduleModals/EditEvent';
import DeleteEventModal from './EventScheduleModals/DeleteEvent';
import { useIsMobileSize } from '../../../../../hooks';

import 'react-big-calendar/lib/sass/styles.scss';
import style from './style.scss';

const locales = { 'en-US': locale };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TimeGutterHeader = () => null;

// eslint-disable-next-line
const Calendar = ({ schedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthYear = useMemo(() => format(currentDate, 'MMM yyyy'), [currentDate]);
  const isMobileSize = useIsMobileSize();
  const view = isMobileSize ? Views.DAY : Views.WEEK;

  const moveNext = useCallback(() => {
    setCurrentDate(view === Views.WEEK
      ? addWeeks(currentDate, 1)
      : addDays(currentDate, 1));
  }, [currentDate, view]);

  const movePrev = useCallback(() => {
    setCurrentDate(view === Views.WEEK
      ? subWeeks(currentDate, 1)
      : subDays(currentDate, 1));
  }, [currentDate, view]);

  const moveToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div>
      <Context.Provider value={{
        moveNext,
        movePrev,
        moveToToday,
        monthYear,
      }}>
        <BigCalendar
          className={style.bigCalendar}
          date={currentDate}
          // navigation is handled from toolbar, it is required since we are using the date property
          onNavigate={() => {}}
          events={schedules}
          defaultView={view}
          views={[view]}
          localizer={localizer}
          drilldownView={null}
          components={{
            toolbar: Toolbar,
            timeGutterHeader: TimeGutterHeader,
            eventWrapper: Event,
          }}
        />
      </Context.Provider>
      <AddEventModal />
      <EditEventModal />
      <DeleteEventModal />
    </div>
  )
};

export default Calendar;
