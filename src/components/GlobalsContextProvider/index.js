import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import io from 'socket.io-client';
import { GlobalsContext } from 'Shared/context';

let socket;
const GlobalsContextProvider = ({ children }) => {
  useEffect(() => {
    const onConnect = () => {
      console.log('socket connected');
      // this needs to be exposed, we need to be able to choose which room we're connecting;
      socket.emit('joinRoom', { room: '58347159', userId: 'zlUserId' });
    };

    if (socket) {
      console.warn('Socket already exists');
      socket.close();
    }

    socket = io(`${process.env.PREACT_APP_WS_PROTOCOL}${process.env.PREACT_APP_API_AUTHORITY}`);
    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect);
      socket.disconnect();
      socket = undefined;
      console.log('socket disconnected');
    };
  }, []);

  return (
    <GlobalsContext.Provider value={{ socket }}>
      {children}
    </GlobalsContext.Provider>
  )
};

export default GlobalsContextProvider;
