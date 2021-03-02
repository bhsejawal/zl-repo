import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import io from 'socket.io-client';
import { GlobalsContext } from 'Shared/context';

const GlobalsContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  const onConnect = () => {
    console.log('socket connected');
    // this needs to be exposed, we need to be able to choose which room we're connecting;
    socket.emit('joinRoom', { room: '58347159', userId: 'zlUserId' });
  };

  useEffect(() => {
    if (!socket) {
      setSocket(io(`${process.env.PREACT_APP_WS_PROTOCOL}${process.env.PREACT_APP_API_AUTHORITY}`));
    }

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.disconnect();
        setSocket(undefined);
        console.log('socket disconnected');
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', onConnect);
    }
  }, [socket]);

  return (
    <GlobalsContext.Provider value={{ socket }}>
      {children}
    </GlobalsContext.Provider>
  )
};

export default GlobalsContextProvider;
