import { min, max } from 'lodash-es';
import { connect } from 'react-redux';
import { useMemo } from 'preact/hooks';
import classnames from 'classnames';
import {
  format,
  startOfDay,
  addDays,
  parseISO,
  isSameDay,
} from 'date-fns';

import { FormPrevious, FormNext } from 'grommet-icons';
import {
  Box,
  Calendar,
  DropButton,
  Button,
} from 'grommet';

import style from '../style.scss';
import { setDateFilter, toggleDateFilter } from '../../actions';

const CalendarFilter = ({
  date,
  showDateFilter,
  setDateFilterAction,
  toggleDateFilterAction,
  availableDates,
}) => {
  const handleDateSelection = (date) => {
    setDateFilterAction(startOfDay(parseISO(date)));
  }

  const minDate = parseISO(min(availableDates));
  const maxDate = parseISO(max(availableDates));
  const readableDate = useMemo(() => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date), [date]);

  if (!availableDates.length) {
    return null;
  }

  const handleSideButtons = (modifier) => {
    const newDate = addDays(startOfDay(date), modifier);
    setDateFilterAction(newDate);
  }

  return (
    <Box direction="row" className={style.calendarButton} justify="center" align="center">
      <Button
        icon={<FormPrevious />}
        onClick={() => handleSideButtons(-1)}
        pad={{ horizontal: '12px'}}
        disabled={isSameDay(date, minDate)}
      />
      <Box
        flex="grow"
        justify="center"
        align="center"
      >
        <DropButton
          label={readableDate}
          dropAlign={{ top: 'bottom' }}
          size="small"
          reverse
          dropContent={
            <Box
              pad={{
                top: "medium",
                left: "medium",
                right: "medium",
                bottom: "small",
              }}
              className={style.filterBox}
            >
              <Calendar
                daysOfWeek
                date={format(date, "yyyy-MM-dd")}
                fill={false}
                onSelect={handleDateSelection}
                bounds={availableDates}
              />
            </Box>
          }
          className={classnames(
            style.dateButton,
            { [style.active]: showDateFilter },
          )}
          onOpen={toggleDateFilterAction}
          onClose={toggleDateFilterAction}
          dropProps={{ elevation: "xlarge" }}
          open={showDateFilter}
        />
      </Box>
      <Button
        icon={<FormNext />}
        onClick={() => handleSideButtons(1)}
        disabled={isSameDay(date, maxDate)}
      />
    </Box>

  )
};

export default connect((
  { schedule: { filters: { date, showDateFilter }, availableDates } },
) => ({ date, showDateFilter, availableDates }), {
  setDateFilterAction: setDateFilter,
  toggleDateFilterAction: toggleDateFilter,
})(CalendarFilter);
