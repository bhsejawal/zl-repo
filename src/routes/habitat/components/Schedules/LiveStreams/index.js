import { connect } from 'react-redux';
import { add, format, startOfDay } from 'date-fns';
import { useEffect, useMemo } from 'preact/hooks';
import useFetch from 'use-http';
import classnames from 'classnames';

import { hasPermission } from 'Components/Authorize';
import { buildURL } from 'Shared/fetch';
import Loader from 'Components/Loader';
import EditButton from 'Components/AdminEditWrappers/EditButton';
import { showEditEventModal } from 'Components/ScheduleEvents/actions';

import Accordion from '../../../../account/Accordion';
import { useIsMobileSize } from '../../../../../hooks';
import { setSchedules } from '../actions';

import style from './style.scss';

const LiveStreams = ({
  date,
  habitatId,
  accordion,
  liveStreams,
  showEditEventModalAction,
  setSchedulesAction,
}) => {
  const isMobileSize = useIsMobileSize();
  const url = useMemo(() => {
    const params = new URLSearchParams({
      habitatId,
      startTime: startOfDay(date).toISOString(),
      stopTime: startOfDay(add(date, { days: 1 })).toISOString(),
      pageSize: 10000,
    });
    return buildURL(`/schedules?${params}`);
  }, [habitatId, date]);

  const { loading, error, data: { events = [] } = {} } = useFetch(
    url,
    { credentials: 'include', cachePolicy: 'no-cache' },
    [habitatId, date],
  );

  useEffect(() => {
    if (error) {
      console.error('Error while fetching streams');
    }
  }, [error]);

  useEffect(() => {
    if (events.length) {
      setSchedulesAction(events);
    }
  }, [events, setSchedulesAction]);

  useEffect(() => {
    if (error) {
      console.error('Error while fetching streams');
    }
  }, [error]);

  if (!liveStreams.length) {
    return null;
  }

  if (loading) {
    return (
      <div className={classnames(style.streamsContainer, style.loading)}>
        <Loader color="white" fill />
      </div>
    );
  }

  const content = (
    <div className={style.streamsContainer}>
      <div className={style.header}>
        <h3>Stream Times</h3>
        <p>Check in during these times to see your favorite animals live:</p>
      </div>
      <div className={style.body}>
        {liveStreams.map((item) => (
          <div key={item._id} className={style.item}>
            {hasPermission('habitat:edit-schedule') && !isMobileSize && (
              <EditButton onClick={() => showEditEventModalAction(true, {
                _id: item._id,
                businessHourId: item.businessHourId,
                start: item.startTime,
                habitatId,
              })} />
            )}
            {`${format(new Date(item.startTime), 'hh:mma')} - ${format(new Date(item.stopTime), 'hh:mma')}`}
          </div>
        ))}
      </div>
    </div>
  );

  if (accordion) {
    return (
      <Accordion
        className={style.accordion}
        header={<h4>Stream Times</h4>}
        expanded
      >
        {content}
      </Accordion>
    )
  }
  return content;
};

export default connect(({
  habitat: {
    habitatInfo: { _id: habitatId },
    schedulesTab: { liveStreams },
  },
}) => ({ habitatId, liveStreams }),
{
  showEditEventModalAction: showEditEventModal,
  setSchedulesAction: setSchedules,
})(LiveStreams);
