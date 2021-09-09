import classnames from 'classnames';
import { useEffect, useState, useCallback } from 'preact/compat';
import { connect } from 'react-redux';
import { route } from 'preact-router';
import CloseButton from 'Components/modals/CloseButton';
import Tag from 'Components/Tag';
import Card from 'Components/Card';
import Rate from './Rate';
import Feedback from './Feedback';

import { removeNotification } from './actions';

import style from './style.scss';

const Notification = ({ data, removeNotificationAction }) => {
  const [animateIn, setAnimateIn] = useState();

  const close = useCallback(() => {
    setAnimateIn(false);
    setTimeout(() => removeNotificationAction(data.id), 1200); // 1.2s is the animation time
  }, [data.id, removeNotificationAction]);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 10);

    if (data.timeout) {
      setTimeout(close, data.timeout);
    }
  }, [close, data.id, data.timeout]);

  const { type } = data;
  if (type === 'liveTalkToast' && data?.id) {
    return (
      <div className={classnames(style.liveTalkCardToast, { [style.animateIn]: animateIn })}>
        <CloseButton
          onClick={close}
          className={style.close}
        />
        <Card
          key={data.id}
          scheduleId={data.id}
          title={data?.schedule?.title}
          zoo={data.zoo}
          header={<Tag label="LIVE NOW" varient="online" />}
          description={data?.schedule?.description}
          image={data.schedule?.habitat?.profileImage}
          habitatId={data?.schedule?.habitat?._id}
          onClick={() => {
            route(`/h/${data.zooSlug}/${data.habitatSlug}`);
            removeNotificationAction(data.id);
          }}
        />
      </div>
    );
  }

  // this is not in use yet
  if (type === 'toast' && data?.id) {
    return (
      <div className={classnames(style.toast, { [style.animateIn]: animateIn })}>
        <CloseButton onClick={close} className={style.close} />
        <div className={style.content}>{data.text}</div>
      </div>
    );
  }

  if (type === 'rate' && data?.id) {
    return (
      <Rate
        className={classnames(style.score, { [style.animateIn]: animateIn })}
        onClose={close}
      />
    );
  }

  if (type === 'feedback' && data?.id) {
    return (
      <Feedback
        className={classnames(style.feedback, { [style.animateIn]: animateIn })}
        onClose={close}
      />
    );
  }

  return null;
};

export default connect(null, { removeNotificationAction: removeNotification })(Notification);
