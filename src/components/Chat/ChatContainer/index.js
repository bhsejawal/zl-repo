import { useEffect, useRef } from 'preact/hooks';
import { connect } from 'react-redux';
import { get } from 'lodash-es';
import classnames from 'classnames';

import InputBox from './InputBox';

import style from './style.module.scss';

import ChatMessage from './ChatMessage';

let autoScroll = true;

const ChatContainer = ({ messages, username }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const bySameUsername = get(messages.slice(-1)[0], 'username') === username;

    if (messages.length && ((autoScroll && chatContainerRef.current) || bySameUsername)) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, username]);

  const onScroll = () => {
    const { scrollHeight, scrollTop, offsetHeight } = chatContainerRef.current;
    autoScroll = false;

    // windows edge and chrome dose not reach scroll height fully and it fluctuates from 0.3 to 0.7
    // 15 is additional auto scroll zone so users don't need to scroll to the very bottom
    if ((Math.ceil(offsetHeight + scrollTop)) >= (scrollHeight - 15)) {
      autoScroll = true;
    }
  };

  return (
    <>
      <div ref={chatContainerRef} className={classnames(style.chatContainer, 'customScrollBar')} onScroll={onScroll}>
        {messages.map(({
          username,
          animal,
          color,
          text,
          messageId,
          timestamp,
        }) => (
          <ChatMessage
            username={username}
            animal={animal}
            color={color}
            text={text}
            key={messageId}
            timestamp={timestamp}
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
