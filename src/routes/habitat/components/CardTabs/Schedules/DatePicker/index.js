import { useMemo } from 'preact/hooks';
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

import { useWindowResize } from '../../../../../../hooks';
import grommetTheme from '../../../../../../grommetTheme';

import style from './style.scss';

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
};

const DatePicker = ({ date, onChange }) => {
  const { width: windowWidth } = useWindowResize();
  const readableDate = useMemo(() => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date), [date]);

  const handleDateSelection = (value) => {
    onChange(startOfDay(parseISO(value)));
  }

  if (!date) {
    return null;
  }

  const handleSideButtons = (modifier) => {
    onChange(addDays(startOfDay(date), modifier));
  }

  return (
    <Box
      direction="row"
      className={style.datePicker}
      justify="center"
      align="center"
    >
      <Button
        icon={<FormPrevious color="var(--grey)" />}
        onClick={() => handleSideButtons(-1)}
        pad={{ horizontal: '12px'}}
        disabled={isSameDay(date, new Date())}
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
            <Box>
              <Grommet theme={calendarTheme}>
                <Calendar
                  size={windowWidth < 440 ? 'small' : 'medium'}
                  daysOfWeek
                  date={format(date, "yyyy-MM-dd")}
                  fill={false}
                  onSelect={handleDateSelection}
                />
              </Grommet>
            </Box>
          }
          className={style.dateButton}

        />
      </Box>
      <Button
        icon={<FormNext color="var(--grey)" />}
        onClick={() => handleSideButtons(1)}
      />
    </Box>

  )
};

export default DatePicker;
