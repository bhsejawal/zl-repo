import { useEffect, useState, useCallback } from 'preact/hooks';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { connect } from 'react-redux';

import { ChatContext } from 'Shared/context';
import {
  addMessages,
  clearMessages,
  markMessageAsDeleted,
  toggleMessageReaction,
} from '../../redux/actions';

import ChatContainer from './ChatContainer';

let pubnub;

const Chat = ({
  habitatId,
  userId,
  animal,
  color,
  username,
  addMessagesAction,
  clearMessagesAction,
  markMessageAsDeletedAction,
  toggleMessageReactionAction,
}) => {
  const [isConnectedToPubnub, setIsConnectedToPubnub] = useState(false);

  const addMessageListener = useCallback((msg) => {
    const { message, timetoken } = msg;
    const timestamp = new Date(parseInt(timetoken, 10) / 10000);
    addMessagesAction([{
      ...message,
      timestamp,
      timetoken,
      reactions: {},
    }]);
  }, [addMessagesAction]);

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
    if (channel !== habitatId) {
      return;
    }
    if (type === 'deleted') {
      markMessageAsDeletedAction(messageTimetoken);
    } else if (type === 'reaction') {
      toggleMessageReactionAction(messageTimetoken, value, actionTimetoken, uuid);
    }
  }, [markMessageAsDeletedAction, habitatId]);

  const handleFetchedMessages = useCallback((status, response) => {
    if (status.statusCode === 200 && response.channels[habitatId]) {
      const messages = response.channels[habitatId];

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

      addMessagesAction(messagesList)
    }
  }, [habitatId, addMessagesAction]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (habitatId && animal && color && userId && username) {
      pubnub = new PubNub({
        publishKey: process.env.PREACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.PREACT_APP_PUBNUB_SUBSCRIPTION_KEY,
        uuid: userId,
        autoNetworkDetection: true,
      });

      const listeners = {
        message: addMessageListener,
        messageAction: messageActionListener,
      };
      pubnub.addListener(listeners);

      pubnub.subscribe({ channels: [habitatId], withPresence: true });

      pubnub.fetchMessages({
        channels: [habitatId],
        count: 50,
        includeMessageActions: true,
      }, handleFetchedMessages);

      setIsConnectedToPubnub(true);

      return () => {
        pubnub.removeListener(listeners);
        pubnub.unsubscribeAll();
        clearMessagesAction();
        setIsConnectedToPubnub(false);
        pubnub = undefined;
      };
    }
  }, [
    habitatId,
    animal,
    color,
    userId,
    username,
    handleFetchedMessages,
    clearMessagesAction,
    addMessageListener,
    messageActionListener,
  ]);

  if (!isConnectedToPubnub) {
    return null;
  }

  return (
    <PubNubProvider client={pubnub}>
      <ChatContext.Provider value={{ pubnub }}>
        <ChatContainer />
      </ChatContext.Provider>
    </PubNubProvider>
  );
}

export default connect(({
  user: {
    userId,
    username,
    profile: {
      animalIcon: animal,
      color,
    },
  },
  habitat: { habitatInfo: { _id: habitatId } },
}) => ({
  userId,
  animal,
  color,
  habitatId,
  username,
}), {
  addMessagesAction: addMessages,
  clearMessagesAction: clearMessages,
  markMessageAsDeletedAction: markMessageAsDeleted,
  toggleMessageReactionAction: toggleMessageReaction,
})(Chat);
