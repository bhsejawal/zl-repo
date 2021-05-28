import { useState, useContext, useCallback } from 'preact/hooks'
import { ResponsiveContext } from 'grommet';

import { connect } from 'react-redux';

import { ChatContext } from 'Shared/context';

import EmoteInput from '../EmoteInput';

import style from './style.module.scss'

const InputBox = ({
  habitatId,
  animal,
  username,
  color,
}) => {
  const { pubnub } = useContext(ChatContext);
  const size = useContext(ResponsiveContext);
  const isSmallScreen = ['small', 'xsmall'].includes(size);

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
    pubnub.publish({ channel: habitatId, message }, () => { setInput('') });
  }, [habitatId, pubnub, animal, color, username]);

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
        {!isSmallScreen && <EmoteInput value={input} onSelection={setInput} />}
      </div>
      <button type="button" onClick={() => sendMessage(input)} className={style.SendButton}>
        Send
      </button>
    </div>
  )
}

export default connect(({
  habitat: { habitatInfo: { _id: habitatId } },
  user: {
    username,
    profile: {
      animalIcon: animal,
      color,
    },
  },
}) => ({
  habitatId,
  username,
  color,
  animal,
}))(InputBox);
