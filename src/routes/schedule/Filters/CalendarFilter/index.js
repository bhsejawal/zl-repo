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
  Grommet,
} from 'grommet';

import { useWindowResize } from '../../../../hooks';
import { setDateFilter, toggleDateFilter } from '../../actions';
import grommetTheme from '../../../../grommetTheme';

import style from '../style.scss';

const calendarTheme = {
  // we need to clear the buttons global style to not impact the next/prev buttons
  global: {
    ...grommetTheme.global,
    colors: {
      brand: 'var(--blueMediumDark)',
    },
  },
  calendar: {
    day: {
      extend: ({ isSelected }) => `
        border-radius: 50px;
        color: ${isSelected ? 'white' : 'var(--grey)'};
        background-color: ${isSelected ? 'var(--blueMediumDark) !important' : 'white'}`,
    },
  },
}
const CalendarFilter = ({
  date,
  showDateFilter,
  setDateFilterAction,
  toggleDateFilterAction,
  availableDates,
}) => {
  const { width: windowWidth } = useWindowResize();

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
    <Box
      direction="row"
      className={classnames(style.calendarButton, { [style.active]: showDateFilter })}
      justify="center"
      align="center"
    >
      <Button
        icon={<FormPrevious color="var(--grey)" />}
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
            <Box className={style.calendarFilterBox}>
              <Grommet theme={calendarTheme}>
                <Calendar
                  size={windowWidth < 440 ? 'small' : 'medium'}
                  daysOfWeek
                  date={format(date, "yyyy-MM-dd")}
                  fill={false}
                  onSelect={handleDateSelection}
                  bounds={availableDates}
                />
              </Grommet>
            </Box>
          }
          className={style.dateButton}
          onOpen={toggleDateFilterAction}
          onClose={toggleDateFilterAction}
          dropProps={{ elevation: "xlarge" }}
          open={showDateFilter}
        />
      </Box>
      <Button
        icon={<FormNext color="var(--grey)" />}
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
