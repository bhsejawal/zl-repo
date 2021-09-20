import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { get, isEmpty, last } from 'lodash-es';
import classnames from 'classnames';
import { usePubNub } from 'pubnub-react';
import { get as fetchGet, post, buildURL } from 'Shared/fetch';

import { logGAEvent } from 'Shared/ga';
import ViewersCount from 'Components/ViewersCount';
import ShareModal from 'Components/ShareModal/Standalone';

import InputBox from './InputBox';

import style from './style.module.scss';

import ChatMessage from './ChatMessage';
import WelcomeMessage from './ChatMessage/WelcomeMessage';
import DeleteMessageModal from './DeleteMessageModal';
import ReportMessageModal from './ReportMessageModal';

let autoScroll = true;

const ChatContainer = ({
  messages,
  username,
  channelId,
  alternate,
  mediaType,
  slug,
  isGuest,
  showHeader,
}) => {
  const [internalMessages, setInternalMessages] = useState([]);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaData, setMediaData] = useState();
  const [message, setMessage] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatContainerRef = useRef(null);
  const pubnub = usePubNub();
  const filteredMessages = useMemo(
    () => internalMessages.filter(({ isDeleted }) => !isDeleted), [internalMessages],
  );

  useEffect(() => {
    if (alternate) {
      setShowWelcome(false);
    }
  }, [alternate]);

  const closeDeleteModalHandler = useCallback(() => {
    setShowDeletionModal(false);
    setMessage(null);
  }, [setShowDeletionModal, setMessage]);

  const closeReportModalHandler = useCallback(() => {
    setShowReportModal(false);
    setMessage(null);
  }, [setShowReportModal, setMessage]);

  const reportMessage = () => {
    post(buildURL('habitats/reportMessage'), { habitatId: channelId, message })
      .catch((err) => console.error(err));
    closeReportModalHandler();
  }

  const promptDeletion = useCallback((msgId) => {
    const msg = internalMessages.find(({ timetoken }) => timetoken === msgId);
    setMessage(msg);
    setShowDeletionModal(true);
  }, [internalMessages]);

  const promptReport = useCallback((msgId) => {
    const msg = internalMessages.find(({ timetoken }) => timetoken === msgId);
    setMessage(msg);
    setShowReportModal(true);
  }, [internalMessages]);

  const onSendHandler = () => {
    if (showWelcome) {
      setShowWelcome(false);
    }

    logGAEvent(
      mediaType ? 'ugc' : 'chat',
      mediaType ? `sent-comment-${mediaType}` : 'sent-message-chat',
      slug,
    );
  };

  const onReactionHandler = () => {
    logGAEvent(
      mediaType ? 'ugc' : 'chat',
      mediaType ? `reacted-comment-${mediaType}` : 'reacted-message-chat',
      slug,
    );
  }

  const deleteMessage = useCallback(() => {
    pubnub.addMessageAction({
      channel: channelId,
      messageTimetoken: message.timetoken,
      action: {
        type: 'deleted',
        value: 'deleted',
      },
    });
    closeDeleteModalHandler();
  }, [pubnub, channelId, message, closeDeleteModalHandler]);

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

  const onMediaClickHandler = useCallback(async (mediaType, mediaId) => {
    let url;
    if (mediaType === 'video') {
      const params = new URLSearchParams();
      params.append('videoIds[]', mediaId);
      url = buildURL(`videos?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      params.append('photoIds[]', mediaId);
      url = buildURL(`photos?${params.toString()}`);
    }

    const { list: [media] } = await fetchGet(url)
      .catch((err) => console.error(err));
    if (media) {
      setMediaData(media);
      setShowMediaModal(true);
    }
  }, []);

  const clearMediaModalState = useCallback(() => {
    setShowMediaModal(false);
    setMediaData();
  }, []);

  return (
    <>
      {showHeader && (
        <div className={style.chatHeader}>
          <span>Community Chat</span>
          <ViewersCount plain />
        </div>
      )}
      <div
        ref={chatContainerRef}
        className={classnames(style.chatContainer, 'customScrollBar', {[style.alternate]: alternate})}
      >
        {filteredMessages.map(({
          username,
          animal,
          color,
          text,
          messageId,
          timestamp,
          timetoken,
          reactions,
          media,
          reply,
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
            onReactionHandler={onReactionHandler}
            onReportHandler={promptReport}
            channelId={channelId}
            alternate={alternate}
            media={media}
            onMediaClickHandler={onMediaClickHandler}
            reply={!isEmpty(reply) && filteredMessages.find(
              ({ timetoken: token }) => (token === reply),
            )}
          />
        ))}
        {showWelcome && (
          <WelcomeMessage onClose={onSendHandler} />
        )}
      </div>
      {!isGuest && (
        <InputBox
          channelId={channelId}
          alternate={alternate}
          onSendHandler={onSendHandler}
        />
      )}
      {showDeletionModal && (
        <DeleteMessageModal onClose={closeDeleteModalHandler} onDelete={deleteMessage} />
      )}
      {showReportModal && (
        <ReportMessageModal
          onClose={closeReportModalHandler}
          onReport={reportMessage}
        />
      )}
      {mediaData && (
        <ShareModal
          open={showMediaModal}
          data={mediaData}
          onClose={clearMediaModalState}
          mediaId={mediaData._id}
          isDownloadAllowed
        />
      )}

    </>
  );
}

export default connect((
  {
    chat: { channels },
    user: { username },
    habitat: {
      habitatInfo: {
        slug: habitatSlug,
        zoo: {
          slug: zooSlug,
        } = {},
      } = {},
    },
  },
) => (
  {
    messages: channels,
    username,
    slug: `${zooSlug}/${habitatSlug}`,
  }
))(ChatContainer);
