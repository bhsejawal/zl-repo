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

import Loader from 'Components/Loader';

import { buildURL } from 'Shared/fetch';
import { connect } from 'react-redux';

const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

const Calendar = lazy(() => import('.'));

const CenteredLoader = () => (
  <Box fill justify="center">
    <Loader height="485px" />
  </Box>
);

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
      startTime,
      stopTime,
      ...rest
    }) => {
      const start = utcToZonedTime(startTime, timeZone);
      const end = utcToZonedTime(stopTime, timeZone);

      if (getDate(start) !== getDate(end)) {
        items.push({
          start,
          end: endOfDay(start),
          ...rest,
        }, {
          start: startOfDay(end),
          end,
          ...rest,
        });
      } else {
        items.push({
          start,
          end,
          ...rest,
        });
      }
    });

    return items;
  }, [events]);

  if (loading) {
    return <CenteredLoader />
  }

  if (error) {
    return (
      <Box height={{ min: '530px' }} align="center" justify="center">
        <p>There was an error. Please try again.</p>
      </Box>
    );
  }

  return (
    <Suspense fallback={<CenteredLoader />}>
      <Calendar schedules={schedules} />
    </Suspense>
  )
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(CalendarLoader);
