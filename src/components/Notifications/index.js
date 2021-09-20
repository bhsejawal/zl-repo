import { useContext, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import { format, utcToZonedTime } from 'date-fns-tz';

import { GlobalsContext } from 'Shared/context';
import Notification from './Notification';
import { addNotification } from './actions';
import { getDesktopOrMobile } from '../../helpers';

import style from './style.scss';

const Notifications = ({
  notifications,
  sessionDurationInSec,
  rate,
  addNotificationAction,
}) => {
  const { socket } = useContext(GlobalsContext);

  useEffect(() => {
    const onToast = (data) => {
      addNotificationAction(data);
    };

    socket?.on('notification', onToast);
    return () => {
      socket?.off('notification', onToast);
    };
  }, [addNotificationAction, socket]);

  useEffect(() => {
    let timeout;

    if (sessionDurationInSec > 600) { // 10 minutes * 60 seconds
      // date (yyyy-mm) is stored in UTC so it needs to be checked in UTC as well
      const date = format(utcToZonedTime(new Date(), 'UTC'), 'yyyy-MM', { timeZone: 'UTC' });
      const existingNotification = notifications.some(({ id }) => id === date);

      if (!rate[`${date}-${getDesktopOrMobile()}`] && !existingNotification) {
        timeout = setTimeout(() => addNotificationAction({ id: date, type: 'rate' }), 1000);
      }
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.notificationsContainer}>
      <div className={style.wrapper}>
        {notifications.map((data) => <Notification key={data.id} data={data} />)}
      </div>
    </div>
  );
};

export default connect(
  ({
    notifications,
    pluginSettings: {
      actionPayloads = {},
    } = {},
    user: {
      sessionDurationInSec,
      rate = {},
    },
  }) => ({
    notifications,
    actionPayloads,
    sessionDurationInSec,
    rate,
  }),
  { addNotificationAction: addNotification },
)(Notifications);
