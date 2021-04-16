import { useEffect, useState, useCallback } from 'preact/hooks';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { connect } from 'react-redux';

import { ChatContext } from 'Shared/context';
import { addMessages, clearMessages } from '../../redux/actions';

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
}) => {
  const [isConnectedToPubnub, setIsConnectedToPubnub] = useState(false);

  const addMessageListener = useCallback((msg) => {
    const { message } = msg;
    addMessagesAction([message])
  }, [addMessagesAction]);

  const handleFetchedMessages = useCallback((status, response) => {
    if (status.statusCode === 200 && response.channels[habitatId]) {
      const messages = response.channels[habitatId];
      const messagesList = messages.map(({ message}) => message);
      addMessagesAction(messagesList)
    }
  }, [habitatId, addMessagesAction]);

  useEffect(() => {
    if (isConnectedToPubnub) {
      pubnub.addListener({
        message: addMessageListener,
      });
    }
  }, [isConnectedToPubnub, addMessagesAction, addMessageListener])

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
        count: 10,
      }, handleFetchedMessages);

      setIsConnectedToPubnub(true);
    }
  }, [habitatId, animal, color, userId, username, handleFetchedMessages])

  useEffect(() => () => {
    if (pubnub) {
      pubnub.unsubscribeAll();
      pubnub.removeListener({ message: addMessageListener });
      clearMessagesAction();
      setIsConnectedToPubnub(false);
    }
  }, [clearMessagesAction, habitatId, addMessageListener]);

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
})(Chat);
