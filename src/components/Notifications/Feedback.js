import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { Text } from 'grommet';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';
import { PrimaryButton } from 'Components/Buttons';
import CloseButton from 'Components/modals/CloseButton';

import { getDeviceType, getDesktopOrMobile } from '../../helpers';
import { setUserData } from '../../redux/actions';

import style from './style.scss';

const Feedback = ({ onClose, className, setUserDataAction }) => {
  const [text, setText] = useState('');

  const {
    post,
    data,
    error,
    loading,
  } = useFetch(buildURL('/users/rate'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    let timeout;

    if (!error && data?.user) {
      setUserDataAction(data.user);
      timeout = setTimeout(() => onClose(), 1500);
    }

    return () => clearTimeout(timeout);
  }, [data, error, onClose, setUserDataAction]);

  const sendFeedback = () => {
    post({ feedback: text, device: getDesktopOrMobile() });
    logGAEvent( 'nps', 'user-feedback-app', getDeviceType(), text );
  };

  return (
    <div className={className}>
      <CloseButton onClick={onClose} className={style.close} />
      <div className={style.content}>
        <span className={style.text}>
          Thanks for the feedback! Can you tell us more?
        </span>

        <div className={style.textArea}>
          <textarea
            cols="30"
            rows="8"
            value={text}
            onChange={({target: { value }}) => setText(value)}
            maxLength="500"
          />
          <Text size="small" weight={700}>{`${text.length}/500`}</Text>
        </div>
        <PrimaryButton
          onClick={sendFeedback}
          loading={loading}
          disabled={!!data?.user || loading || !text.length}
          label={data?.user ? 'Sent' : 'Send'}
          size="small"
        />
        {error && <div className={style.error}>Try Again!</div>}
      </div>
    </div>
  )
}

export default connect(null, { setUserDataAction: setUserData })(Feedback);
