import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useMemo } from 'preact/hooks';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from 'grommet';
import classnames from 'classnames';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import { setUserData } from '../../redux/actions';
import Button from '../Button';

import style from './style.scss';

const Card = ({
  scheduleId,
  animal,
  zoo,
  startTime,
  header,
  description,
  image,
  onClick,
  live,
  loading,
  roundImage,
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
    if (scheduleId || (animal && zoo && startTime)) {
      return scheduledEvents.some(({
        scheduleId: eventScheduleId,
        animal: eventAnimal,
        zoo: eventZoo,
        startTime: eventStart,
      }) => {
        const sameScheduleId = eventScheduleId === scheduleId;
        // in case we re-generate new schedules, IDs will be different therefore
        // we need to compare event other info to check if user already received a reminder
        const sameEventInfo = animal === eventAnimal
          && zoo === eventZoo
          && startTime.toISOString() === eventStart;

        return sameScheduleId || sameEventInfo;
      });
    }

    return false;
  }, [animal, scheduleId, scheduledEvents, startTime, zoo]);

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
          <Button
            onClick={onCLickHandler(scheduleId)}
            disabled={isReminded}
            className={classnames({ shimmer: loading })}
            variant={live ? 'secondary' : 'outline'} size="xs"
          >
            {sendingReminder && !loading && (
              <Box pad={{horizontal: '20px', vertical: '3px'}}>
                <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '16px'}} />
              </Box>
            )}
            {!sendingReminder && error && 'Try Again!'}
            {!sendingReminder && !error && 'Remind me'}
          </Button>
        </div>
        <div className={style.image}>
          <img src={image} alt="" className={classnames({ [style.round]: roundImage })} />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ user: { scheduledEvents }}) => ({ scheduledEvents }),
  { setUserDataAction: setUserData },
)(Card);
