import { useState, useEffect, useRef } from 'preact/hooks';
import { connect } from 'react-redux';
import { get, last } from 'lodash-es';
import classnames from 'classnames';

import InputBox from './InputBox';

import style from './style.module.scss';

import ChatMessage from './ChatMessage';

let autoScroll = true;

const ChatContainer = ({ messages, username }) => {
  const [internalMessages, setInternalMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const { scrollHeight, scrollTop, offsetHeight } = chatContainerRef.current;
    // windows edge and chrome dose not reach scroll height fully and it fluctuates from 0.3 to 0.7
    // 15 is additional auto scroll zone so users don't need to scroll to the very bottom
    autoScroll = (Math.ceil(offsetHeight + scrollTop)) >= (scrollHeight - 15);

    setInternalMessages(messages);
  }, [messages]);

  useEffect(() => {
    const bySameUsername = get(last(internalMessages), 'username') === username;

    if (internalMessages.length && ((autoScroll && chatContainerRef.current) || bySameUsername)) {
      const { scrollHeight, offsetHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - offsetHeight;
    }
  }, [internalMessages, username]);

  return (
    <>
      <div ref={chatContainerRef} className={classnames(style.chatContainer, 'customScrollBar')}>
        {internalMessages.map(({
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
