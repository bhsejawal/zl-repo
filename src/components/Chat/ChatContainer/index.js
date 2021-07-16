import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { get, last } from 'lodash-es';
import classnames from 'classnames';
import { usePubNub } from 'pubnub-react';

import InputBox from './InputBox';

import style from './style.module.scss';

import ChatMessage from './ChatMessage';
import WelcomeMessage from './ChatMessage/WelcomeMessage';
import DeleteMessageModal from './DeleteMessageModal';

let autoScroll = true;

const ChatContainer = ({
  messages,
  username,
  channelId,
  alternate,
}) => {
  const [internalMessages, setInternalMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatContainerRef = useRef(null);
  const pubnub = usePubNub();

  useEffect(() => {
    if (alternate) {
      setShowWelcome(false);
    }
  }, [alternate]);

  const onCloseHandler = useCallback(() => {
    setShowModal(false);
    setMessageId(null);
  }, [setShowModal, setMessageId]);

  const promptDeletion = useCallback((msgId) => {
    setMessageId(msgId);
    setShowModal(true);
  }, []);

  const onSendHandler = () => {
    if (showWelcome) {
      setShowWelcome(false);
    }
  };

  const deleteMessage = useCallback(() => {
    pubnub.addMessageAction({
      channel: channelId,
      messageTimetoken: messageId,
      action: {
        type: 'deleted',
        value: 'deleted',
      },
    });
    onCloseHandler();
  }, [pubnub, channelId, messageId, onCloseHandler]);

  useEffect(() => {
    const { scrollHeight, scrollTop, offsetHeight } = chatContainerRef.current;
    // windows edge and chrome dose not reach scroll height fully and it fluctuates from 0.3 to 0.7
    // 15 is additional auto scroll zone so users don't need to scroll to the very bottom
    autoScroll = (Math.ceil(offsetHeight + scrollTop)) >= (scrollHeight - 15);

    setInternalMessages(messages[channelId]?.messages ?? []);
  }, [messages, channelId]);

  useEffect(() => {
    const bySameUsername = get(last(internalMessages), 'username') === username;

    if (internalMessages.length && ((autoScroll && chatContainerRef.current) || bySameUsername)) {
      const { scrollHeight, offsetHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - offsetHeight;
    }
  }, [internalMessages, username]);

  return (
    <>
      <div
        ref={chatContainerRef}
        className={classnames(style.chatContainer, 'customScrollBar', {[style.alternate]: alternate})}
      >
        {internalMessages.filter(({ isDeleted }) => !isDeleted).map(({
          username,
          animal,
          color,
          text,
          messageId,
          timestamp,
          timetoken,
          reactions,
          media,
        }) => (
          <ChatMessage
            username={username}
            animal={animal}
            color={color}
            text={text}
            key={messageId}
            timestamp={timestamp}
            timetoken={timetoken}
            reactions={reactions}
            onDeleteHandler={promptDeletion}
            channelId={channelId}
            alternate={alternate}
            media={media}
          />
        ))}
        {showWelcome && (
          <WelcomeMessage onClose={onSendHandler} />
        )}
      </div>
      <InputBox channelId={channelId} alternate={alternate} onSendHandler={onSendHandler} />
      {showModal && <DeleteMessageModal onClose={onCloseHandler} onDelete={deleteMessage} />}
    </>
  );
}

export default connect((
  { chat: { channels }, user: { username }},
) => (
  { messages: channels, username }
))(ChatContainer);
