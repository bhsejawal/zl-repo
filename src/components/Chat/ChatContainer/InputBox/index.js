import { useState, useContext, useCallback } from 'preact/hooks'

import { connect } from 'react-redux';

import { ChatContext } from 'Shared/context';

import EmoteInput from '../EmoteInput';

import style from './style.module.scss'

const InputBox = ({
  channelId,
  animal,
  username,
  color,
}) => {
  const { pubnub } = useContext(ChatContext);

  const [input, setInput] = useState('');

  const sendMessage = useCallback((text) => {
    if (!text.length) {
      return;
    }

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
    <div className={style.inputBox}>
      <div className={style.inputContainer}>
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDownHandler}

        />
        <EmoteInput value={input} onSelection={setInput} />
      </div>
      <button type="button" onClick={() => sendMessage(input)} className={style.SendButton}>
        Send
      </button>
    </div>
  )
}

export default connect(({
  mainStream: { channelId },
  user: {
    profile: {
      animalIcon: animal,
      color,
      nickname: username,
    },
  },
}) => ({
  channelId,
  username,
  color,
  animal,
}))(InputBox);
