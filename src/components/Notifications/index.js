import { useContext, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';

import { GlobalsContext } from 'Shared/context';
import Notification from './Notification';
import { addNotification } from './actions';

import style from './style.scss';

const Notifications = ({ notifications, addNotificationAction }) => {
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
  }) => ({
    notifications,
    actionPayloads,
  }),
  {
    addNotificationAction: addNotification,
  },
)(Notifications);
