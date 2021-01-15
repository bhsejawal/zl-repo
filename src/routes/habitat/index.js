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

  const streamWidth = windowWidth * 0.75;
  const chatWidth = windowWidth * 0.15;
  const sideBarWidth = windowWidth * 0.1;
  const height = (windowWidth * 0.75) * 0.5625;

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
