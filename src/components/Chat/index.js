import { useEffect, useState, useCallback } from 'preact/hooks';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { connect } from 'react-redux';

import { ChatContext } from '../../context';
import { addMessage, clearMessages } from '../../redux/actions';

import ChatContainer from './ChatContainer';

let pubnub;

const Chat = ({
  channelId,
  userId,
  animal,
  color,
  username,
  addMessageAction,
  clearMessagesAction,
}) => {
  const [isConnectedToPubnub, setIsConnectedToPubnub] = useState(false);

  const addMessageListener = useCallback((msg) => {
    const { message } = msg;
    addMessageAction(message)
  }, [addMessageAction]);

  useEffect(() => {
    if (isConnectedToPubnub) {
      pubnub.addListener({
        message: addMessageListener,
      });
    }
  }, [isConnectedToPubnub, addMessageAction, addMessageListener])

  useEffect(() => {
    if (channelId && animal && color && userId && username) {
      pubnub = new PubNub({
        publishKey: process.env.PREACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.PREACT_APP_PUBNUB_SUBSCRIPTION_KEY,
        uuid: userId,
        autoNetworkDetection: true,
      });

      pubnub.subscribe({ channels: [channelId], withPresence: true });

      pubnub.objects.setUUIDMetadata({
        data: {
          name: username,
          custom: { animal, color },
        },
      });

      setIsConnectedToPubnub(true);
    }
  }, [channelId, animal, color, userId, username])

  useEffect(() => () => {
    if (pubnub) {
      pubnub.unsubscribeAll();
      pubnub.removeListener({ message: addMessageListener });
      clearMessagesAction();
      setIsConnectedToPubnub(false);
    }
  }, [clearMessagesAction, channelId, addMessageListener]);

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
    viewer: {
      userId,
      animal,
      color,
      username,
    },
  },
  mainStream: { channelId },
}) => ({
  userId,
  animal,
  color,
  channelId,
  username,
}), {
  addMessageAction: addMessage,
  clearMessagesAction: clearMessages,
})(Chat);
