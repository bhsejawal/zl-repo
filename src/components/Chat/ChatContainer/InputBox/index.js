import { useState, useContext, useCallback } from 'preact/hooks'
import { connect } from 'react-redux';
import classnames from 'classnames';

import { ChatContext } from 'Shared/context';
import EmoteInput from '../EmoteInput';
import { useIsMobileSize } from '../../../../hooks';

import style from './style.module.scss'

const InputBox = ({
  channelId,
  animal,
  username,
  color,
  alternate,
  onSendHandler,
}) => {
  const { pubnub } = useContext(ChatContext);
  const isMobileSize = useIsMobileSize();

  const [input, setInput] = useState('');

  const sendMessage = useCallback((text) => {
    if (!text.length) {
      return;
    }

    onSendHandler();

    const message = {
      text,
      animal,
      color,
      username,
    }
    pubnub.publish({ channel: channelId, message }, () => { setInput('') });
  }, [channelId, pubnub, animal, color, username]);

  const onKeyDownHandler = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      evt.stopPropagation();
      sendMessage(input);
    }
  };

  return (
    <div className={classnames(style.inputBox, {[style.alternate]: alternate })}>
      <div className={style.inputContainer}>
        <div className={style.inputWrapper}>
          <input
            type="text"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDownHandler}

          />
          {!isMobileSize && <EmoteInput value={input} onSelection={setInput} />}
        </div>
      </div>
      <button type="button" onClick={() => sendMessage(input)} className={style.SendButton}>
        Send
      </button>
    </div>
  )
}

export default connect(({
  user: {
    username,
    profile: {
      animalIcon: animal,
      color,
    },
  },
}) => ({
  username,
  color,
  animal,
}))(InputBox);
