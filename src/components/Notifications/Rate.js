import { connect } from 'react-redux';
import {useEffect, useState} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';
import { buildURL } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';
import CloseButton from 'Components/modals/CloseButton';
import { addNotification } from './actions';
import { getDeviceType } from '../../helpers';
import { setUserData } from '../../redux/actions';

import style from './style.scss';

const Rate = ({
  onClose,
  className,
  setUserDataAction,
  addNotificationAction,
}) => {
  const [rate, setRate] = useState();

  const { post, data, error } = useFetch(buildURL('/users/rate'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (rate) {
      post({ stars: rate });
      logGAEvent( 'nps', 'user-rated-app', getDeviceType(), rate );
    }
  }, [post, rate]);

  useEffect(() => {
    let timeout;

    if (!error && data?.user) {
      setUserDataAction(data.user);
      timeout = setTimeout(() => {
        onClose();
        addNotificationAction({ id: new Date(), type: 'feedback' });
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [data, error, onClose, setUserDataAction, addNotificationAction]);

  return (
    <div className={className}>
      <CloseButton onClick={onClose} className={style.close} />
      <div className={style.content}>
        <span className={style.text}>
          How likely are you to recommend Zoolife to a friend?
        </span>

        <div className={style.stars}>
          {[1, 2, 3, 4, 5].map((item) => (
            <FontAwesomeIcon
              icon={faStar}
              onClick={() => setRate(item)}
              className={classnames({ [style.active]: rate >= item })}
            />
          ))}
        </div>
        {error && <div className={style.error}>Try Again!</div>}
      </div>
    </div>
  )
}

export default connect(null, {
  setUserDataAction: setUserData,
  addNotificationAction: addNotification,
})(Rate);
