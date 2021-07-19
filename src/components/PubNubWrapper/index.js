import PubNub from 'pubnub';
import { connect } from 'react-redux';
import { PubNubProvider } from 'pubnub-react';
import { ChatContext } from 'Shared/context';
import { useState, useEffect } from 'preact/hooks';

let pubnub;

const PubNubWrapper = ({ userId, children }) => {
  const [isConnectedToPubnub, setIsConnectedToPubnub] = useState(false);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (userId) {
      pubnub = new PubNub({
        publishKey: process.env.PREACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.PREACT_APP_PUBNUB_SUBSCRIPTION_KEY,
        uuid: userId,
        autoNetworkDetection: true,
      });

      setIsConnectedToPubnub(true);

      return () => {
        setIsConnectedToPubnub(false);
        pubnub = undefined;
      };
    }
  }, [userId]);

  if (!isConnectedToPubnub) {
    return null;
  }

  return (
    <PubNubProvider client={pubnub}>
      <ChatContext.Provider value={{ pubnub }}>
        {children}
      </ChatContext.Provider>
    </PubNubProvider>
  )
};

export default connect(({ user: { userId }}) => ({ userId }))(PubNubWrapper)
