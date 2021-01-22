import { useEffect, useRef } from 'preact/hooks';
import { connect } from 'react-redux';

import InputBox from './InputBox';

import style from './style.module.scss';

import ChatMessage from './ChatMessage';

const ChatContainer = ({ messages }) => {
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);
  return (
    <>
      <div ref={chatContainerRef} className={style.chatContainer}>
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

export default connect(({ chat: { messages }}) => ({ messages }))(ChatContainer);
