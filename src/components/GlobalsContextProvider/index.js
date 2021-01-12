import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import io from 'socket.io-client';
import { GlobalsContext } from '../../context';

let socket;
const GlobalsContextProvider = ({ children }) => {
  useEffect(() => {
    const onConnect = () => {
      console.log('socket connected');
      socket.emit('joinRoom', { room: 'zlRoom', userId: 'zlUserId' });
    };

    if (socket) {
      throw new Error('Socket already exists');
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
