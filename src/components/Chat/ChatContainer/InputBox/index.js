import { useState, useContext, useCallback } from 'preact/hooks'
import { connect } from 'react-redux';
import classnames from 'classnames';

import { ChatContext } from 'Shared/context';
import CloseButton from 'Components/modals/CloseButton';
import EmoteInput from '../EmoteInput';
import { useIsMobileSize } from '../../../../hooks';
import { clearReplyMessage } from '../../../../redux/actions';

import style from './style.module.scss'

const InputBox = ({
  channelId,
  animal,
  username,
  userBadge,
  replyUsername,
  color,
  timetoken,
  alternate,
  onSendHandler,
  clearReplyMessageAction,
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
      reply: timetoken,
      badges: userBadge ? [userBadge] : [],
    }
    pubnub.publish({ channel: channelId, message }, () => { setInput('') });
    clearReplyMessageAction();
  }, [
    onSendHandler, animal, color, username, userBadge,
    timetoken, pubnub, channelId, clearReplyMessageAction]);

  const onKeyDownHandler = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      evt.stopPropagation();
      sendMessage(input);
    }
  };

  return (
    <div
      className={classnames(style.inputBox, {
        [style.alternate]: alternate,
        [style.replyMessage]: timetoken,
      })}>
      {timetoken && (
        <div className={style.replyMessageContainer}>
          <CloseButton onClick={clearReplyMessageAction} className={style.close} />
          <div className={style.header}>
            <span>
              Replying to:
              &nbsp;
              <b>{replyUsername}</b>
            </span>
          </div>
        </div>
      )}
      <div className={style.container}>
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
    userBadge,
  },
  chat: { replyMessage: { timetoken, username: replyUsername }},
}) => ({
  username,
  userBadge,
  replyUsername,
  color,
  animal,
  timetoken,
}), {
  clearReplyMessageAction: clearReplyMessage,
})(InputBox);
