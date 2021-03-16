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
import { connect } from 'react-redux';

const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

const Calendar = lazy(() => import('.'));

const CalendarLoader = ({ habitatId }) => {
  const url = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    const startTime = weekStart.toISOString();
    const stopTime = addWeeks(weekStart, 4).toISOString();
    const pageSize = 10000;
    const params = new URLSearchParams({
      habitatId,
      startTime,
      stopTime,
      pageSize,
    });
    return buildURL(`/schedules?${params}`);
  }, [habitatId]);

  const { loading, error, data: { events = [] } = {} } = useFetch(
    url,
    { credentials: 'include', cachePolicy: 'no-cache' },
    [],
  );

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
    return <Loader height="485px" />
  }

  if (error) {
    return (
      <Box height={{ min: '530px' }} align="center" justify="center">
        <p>There was an error. Please try again.</p>
      </Box>
    );
  }

  return (
    <Suspense fallback={<Loader height="485px" />}>
      <Calendar schedules={schedules} />
    </Suspense>
  )
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(CalendarLoader);
