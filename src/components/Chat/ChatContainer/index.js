import { useEffect, useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { get } from 'lodash-es';

import InputBox from './InputBox';

import style from './style.module.scss';

import ChatMessage from './ChatMessage';

const ChatContainer = ({ messages, username }) => {
  const chatContainerRef = useRef(null);
  const [scroll, setScroll] = useState(true);

  const scrollToBottom = () => {
    const bySameUsername = get(messages.slice(-1)[0], 'username') === username;
    if (messages.length && ((scroll && chatContainerRef.current) || bySameUsername)) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages, scroll, username]);

  const onScroll = (e) => {
    const { scrollHeight, scrollTop, offsetHeight } = e.target;

    setScroll(false);

    if (offsetHeight + scrollTop >= scrollHeight) {
      setScroll(true);
    }
  };

  return (
    <>
      <div ref={chatContainerRef} className={style.chatContainer} onScroll={onScroll}>
        {messages.map(({
          username,
          animal,
          color,
          text,
          messageId,
        }) => (
          <ChatMessage
            username={username}
            animal={animal}
            color={color}
            text={text}
            key={messageId}
          />
        ))}
      </div>
      <InputBox />
    </>
  );
}

export default connect(
  ({ chat: { messages }, user: { username }}) => ({ messages, username }),
)(ChatContainer);
