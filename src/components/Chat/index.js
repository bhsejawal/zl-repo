import { useEffect, useState, useCallback } from 'preact/hooks';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { connect } from 'react-redux';

import { ChatContext } from 'Shared/context';
import { addMessages, clearMessages, markMessageAsDeleted } from '../../redux/actions';

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
}) => {
  const [isConnectedToPubnub, setIsConnectedToPubnub] = useState(false);

  const addMessageListener = useCallback((msg) => {
    const { message, timetoken } = msg;
    const timestamp = new Date(parseInt(timetoken, 10) / 10000);
    addMessagesAction([{ ...message, timestamp, timetoken }])
  }, [addMessagesAction]);

  const deleteMessageListener = useCallback(({ channel, data: { type, messageTimetoken }}) => {
    if (type === 'deleted' && channel === habitatId) {
      markMessageAsDeletedAction(messageTimetoken);
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

        return {
          ...message,
          timetoken,
          timestamp,
          isDeleted,
        };
      });

      addMessagesAction(messagesList)
    }
  }, [habitatId, addMessagesAction]);

  useEffect(() => {
    if (isConnectedToPubnub) {
      pubnub.addListener({
        message: addMessageListener,
        messageAction: deleteMessageListener,
      });
    }
  }, [isConnectedToPubnub, addMessagesAction, addMessageListener, deleteMessageListener])

  useEffect(() => {
    if (habitatId && animal && color && userId && username) {
      pubnub = new PubNub({
        publishKey: process.env.PREACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.PREACT_APP_PUBNUB_SUBSCRIPTION_KEY,
        uuid: userId,
        autoNetworkDetection: true,
      });

      pubnub.subscribe({ channels: [habitatId], withPresence: true });

      pubnub.fetchMessages({
        channels: [habitatId],
        count: 50,
        includeMessageActions: true,
      }, handleFetchedMessages);

      setIsConnectedToPubnub(true);
    }
  }, [habitatId, animal, color, userId, username, handleFetchedMessages])

  useEffect(() => () => {
    if (pubnub) {
      pubnub.unsubscribeAll();
      pubnub.removeListener({ message: addMessageListener, messageAction: deleteMessageListener});
      clearMessagesAction();
      setIsConnectedToPubnub(false);
    }
  }, [clearMessagesAction, habitatId, addMessageListener, deleteMessageListener]);

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
})(Chat);
