import { h } from 'preact';

import LiveStream from '../../components/LiveStream';
import Chat from './components/Chat';
import NextTalkBar from './components/NextTalkBar';
import CardTabs from './components/CardTabs';
import StreamProfile from './components/StreamProfile';

import GlobalsContextProvider from "../../components/GlobalsContextProvider";
import { useWindowResize } from '../../hooks';

import style from './style.scss';

const Habitat = () => {
  const { width: windowWidth } = useWindowResize();

  const sideBarWidth = 84;
  const chatWidth = 285;
  const streamWidth = windowWidth - sideBarWidth - chatWidth;
  const height = streamWidth * 0.5625;

  return (
    <GlobalsContextProvider>
      <div className={style.habitat}>
        <div className={style.topSection}>
          <NextTalkBar width={sideBarWidth} height={height} />
          <LiveStream width={streamWidth} height={height} streamId="384199109141848371717542" interactive />
          <Chat width={chatWidth} height={height} />
        </div>

        <div className={style.middleSection}>
          <StreamProfile />
        </div>

        <div className={style.bottomSection}>
          <CardTabs />
        </div>
      </div>
    </GlobalsContextProvider>
  );
}

export default Habitat;
