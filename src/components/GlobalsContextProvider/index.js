import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import io from 'socket.io-client';
import { GlobalsContext } from 'Shared/context';

const GlobalsContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    if (!socket) {
      setSocket(io(`${process.env.PREACT_APP_WS_PROTOCOL}${process.env.PREACT_APP_API_AUTHORITY}`, {
        transports: ['websocket'],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    if (socket) {
      socket.disconnect();
      setSocket(undefined);
      console.log('socket disconnected');
    }
  }, [socket]);

  return (
    <GlobalsContext.Provider value={{ socket }}>
      {children}
    </GlobalsContext.Provider>
  )
};

export default GlobalsContextProvider;
