import { h } from 'preact';
import { lazy, Suspense, useMemo } from 'preact/compat';
import { Box } from 'grommet';

import { utcToZonedTime } from 'date-fns-tz';
import {
  addWeeks,
  endOfDay,
  getDate,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import useFetch from 'use-http';

import Loader from 'Components/async/Loader';

import { buildURL } from 'Shared/fetch';

const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

const Calendar = lazy(() => import('.'));

const CalendarLoader = () => {
  const url = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    const startTime = weekStart.toISOString();
    const stopTime = addWeeks(weekStart, 4).toISOString();
    const pageSize = 10000;
    // TODO: we should read habitatId from somewhere (guessing redux)
    // const params = new URLSearchParams({ habitatId, startTime, stopTime, pageSize });
    const params = new URLSearchParams({ pageSize, startTime, stopTime });
    return buildURL(`/schedules?${params}`);
  }, []);

  const { loading, error, data: { events = [] } = {} } = useFetch(url, null, []);
  const schedules = useMemo(() => {
    const items = [];

    events.forEach(({
      twitchTitle,
      startTime,
      stopTime,
      ...rest
    }) => {
      const start = utcToZonedTime(startTime, timeZone);
      const end = utcToZonedTime(stopTime, timeZone);

      if (getDate(start) !== getDate(end)) {
        items.push({
          title: twitchTitle,
          start,
          end: endOfDay(start),
          ...rest,
        }, {
          title: twitchTitle,
          start: startOfDay(end),
          end,
          ...rest,
        });
      } else {
        items.push({
          title: twitchTitle,
          start,
          end,
          ...rest,
        });
      }
    });

    return items;
  }, [events]);

  if (loading) {
    return <Loader height="450px" />
  }

  if (error) {
    return (
      <Box height={{ min: '530px' }} align="center" justify="center">
        <p>There was an error. Please try again.</p>
      </Box>
    );
  }

  return (
    <Suspense fallback={<Loader height="450px" />}>
      <Calendar schedules={schedules} />
    </Suspense>
  )
};

export default CalendarLoader;
