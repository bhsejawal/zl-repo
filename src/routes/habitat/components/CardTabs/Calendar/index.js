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
} from 'date-fns';

import Event from './Event';
import Header from './Header';
import TimeGutterHeader from './TimeGutterHeader';

import Context from './Context';

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

// eslint-disable-next-line
const Calendar = ({ schedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthYear = useMemo(() => format(currentDate, 'MMM yyyy'), [currentDate]);

  const moveNext = useCallback(() => {
    setCurrentDate(addWeeks(currentDate, 1));
  }, [currentDate]);

  const movePrev = useCallback(() => {
    setCurrentDate(subWeeks(currentDate, 1));
  }, [currentDate]);

  return (
    <div>
      <Context.Provider value={{ moveNext, movePrev, monthYear }}>
        <BigCalendar
          className={style.bigCalendar}
          date={currentDate}
          events={schedules}
          defaultView={Views.WEEK}
          views={[Views.WEEK]}
          localizer={localizer}
          drilldownView={null}
          toolbar={false}
          components={{
            header: Header,
            timeGutterHeader: TimeGutterHeader,
            eventWrapper: Event,
          }}
        />
      </Context.Provider>
    </div>
  )
};

export default Calendar;
