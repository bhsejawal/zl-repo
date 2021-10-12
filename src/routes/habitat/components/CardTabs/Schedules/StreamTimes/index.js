import { connect } from 'react-redux';
import { add, format, startOfDay } from 'date-fns';
import { useEffect, useMemo } from 'preact/hooks';
import { buildURL } from 'Shared/fetch';
import useFetch from 'use-http';
import classnames from 'classnames';
import Loader from 'Components/Loader';

import Accordion from '../../../../../account/Accordion';

import style from './style.scss';

const StreamTimes = ({ date, habitatId, accordion }) => {
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

  const list = useMemo(() => events.filter(({ eventType }) => (eventType === 'live')), [events]);

  useEffect(() => {
    if (error) {
      console.error('Error while fetching streams');
    }
  }, [error]);

  if (!list.length) {
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
        {list.map((item) => (
          <div className={style.item}>
            {`${format(new Date(item.startTime), 'ha')} - ${format(new Date(item.stopTime), 'ha')}`}
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

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(StreamTimes);
