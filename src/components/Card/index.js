import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useMemo } from 'preact/hooks';
import classnames from 'classnames';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import { setUserData } from '../../redux/actions';
import { OutlineButton } from '../Buttons';

import style from './style.scss';

const Card = ({
  scheduleId,
  title,
  zoo,
  startTime,
  header,
  description,
  image,
  onClick,
  loading,
  scheduledEvents,
  setUserDataAction,
}) => {
  const {
    post,
    error,
    data,
    loading: sendingReminder,
  } = useFetch(buildURL('/schedules/reminder'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const isReminded = useMemo(() => {
    if (scheduleId || (title && zoo && startTime)) {
      return scheduledEvents.some(({
        scheduleId: eventScheduleId,
        title: eventTitle,
        zoo: eventZoo,
        startTime: eventStart,
      }) => {
        const sameScheduleId = eventScheduleId === scheduleId;
        // in case we re-generate new schedules, IDs will be different therefore
        // we need to compare event other info to check if user already received a reminder
        const sameEventInfo = title === eventTitle
          && zoo === eventZoo
          && startTime.toISOString() === eventStart;

        return sameScheduleId || sameEventInfo;
      });
    }

    return false;
  }, [title, scheduleId, scheduledEvents, startTime, zoo]);

  useEffect(() => {
    if (error) {
      console.error("Error sending an email", error);
    } else if (data && data.user) {
      setUserDataAction(data.user);
    }
  }, [error, data, setUserDataAction]);

  const onCLickHandler = (id) => async () => {
    if (onClick) {
      onClick(id);
    } else {
      await post({scheduleId: id});
    }
  }

  return (
    <div className={classnames(style.card, { [style.loading]: loading })}>
      <div className={style.wrapper}>
        <div className={style.content}>
          <div className={classnames(style.header, { shimmer: loading })}>{header}</div>
          <div className={classnames(style.description, { shimmer: loading })}>{description}</div>
          <OutlineButton
            onClick={onCLickHandler(scheduleId)}
            disabled={isReminded}
            className={classnames({ shimmer: loading })}
            size="medium"
            label={!sendingReminder && (error ? 'Try Again!' : 'Remind me')}
            margin={{top: '10px'}}
            loading={sendingReminder && !loading}
          />
        </div>
        <div className={style.image}>
          <img src={image} alt="" />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ user: { scheduledEvents }}) => ({ scheduledEvents }),
  { setUserDataAction: setUserData },
)(Card);
