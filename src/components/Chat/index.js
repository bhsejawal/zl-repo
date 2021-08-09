import { useEffect, useCallback } from 'preact/hooks';
import { connect } from 'react-redux';
import { usePubNub } from 'pubnub-react';

import {
  addMessages,
  clearMessages,
  markMessageAsDeleted,
  toggleMessageReaction,
} from '../../redux/actions';

import ChatContainer from './ChatContainer';

const Chat = ({
  channelId,
  userId,
  animal,
  color,
  username,
  addMessagesAction,
  clearMessagesAction,
  markMessageAsDeletedAction,
  toggleMessageReactionAction,
  mediaType,
  alternate = false,
  isGuest,
}) => {
  const pubnub = usePubNub();

  const addMessageListener = useCallback((msg) => {
    const { message, timetoken, channel } = msg;

    if (channel !== channelId) {
      return;
    }

    const timestamp = new Date(parseInt(timetoken, 10) / 10000);
    addMessagesAction(channelId, [{
      ...message,
      timestamp,
      timetoken,
      reactions: {},
    }]);
  }, [addMessagesAction, channelId]);

  const messageActionListener = useCallback(({
    channel,
    data: {
      type,
      messageTimetoken,
      value,
      actionTimetoken,
      uuid,
    },
  }) => {
    if (channel !== channelId) {
      return;
    }
    if (type === 'deleted') {
      markMessageAsDeletedAction(channelId, messageTimetoken);
    } else if (type === 'reaction') {
      toggleMessageReactionAction(channelId, messageTimetoken, value, actionTimetoken, uuid);
    }
  }, [markMessageAsDeletedAction, channelId]);

  const handleFetchedMessages = useCallback((status, response) => {
    if (status.statusCode === 200 && response.channels[channelId]) {
      const messages = response.channels[channelId];

      const messagesList = messages.map(({
        message,
        timetoken,
        actions = {},
        data = {},
      }) => {
        const timestamp = new Date(parseInt(timetoken, 10) / 10000);
        const isDeleted = 'deleted' in actions || 'deleted' in data;
        const { reaction: reactions = {} } = actions;
        return {
          ...message,
          timetoken,
          timestamp,
          isDeleted,
          reactions,
        };
      });

      addMessagesAction(channelId, messagesList)
    }
  }, [channelId, addMessagesAction]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if ((channelId && animal && color && userId && username) || isGuest) {
      const listeners = {
        message: addMessageListener,
        messageAction: messageActionListener,
      };

      pubnub.fetchMessages({
        channels: [channelId],
        count: 50,
        includeMessageActions: true,
      }, handleFetchedMessages);

      if (!isGuest) {
        pubnub.addListener(listeners);

        pubnub.subscribe({ channels: [channelId], withPresence: true });
      }

      return () => {
        if (!isGuest) {
          pubnub.removeListener(listeners);
          pubnub.unsubscribe({ channels: [channelId]});
        }
        clearMessagesAction(channelId);
      };
    }
  }, [
    pubnub,
    channelId,
    animal,
    color,
    userId,
    username,
    handleFetchedMessages,
    clearMessagesAction,
    addMessageListener,
    messageActionListener,
    isGuest,
  ]);

  return (
    <ChatContainer
      channelId={channelId}
      alternate={alternate}
      mediaType={mediaType}
      isGuest={isGuest}
    />
  );
}

export default connect(({
  user: {
    userId,
    username,
    profile: {
      animalIcon: animal,
      color,
    } = {},
  } = {},
}) => ({
  userId,
  animal,
  color,
  username,
}), {
  addMessagesAction: addMessages,
  clearMessagesAction: clearMessages,
  markMessageAsDeletedAction: markMessageAsDeleted,
  toggleMessageReactionAction: toggleMessageReaction,
})(Chat);
