import { h } from 'preact';

import LiveStream from '../../components/LiveStream';
import Chat from './components/Chat';
import NextTalkBar from './components/NextTalkBar';

import { useWindowResize } from '../../hooks';

import style from './style.scss';

const Habitat = () => {
  const { width: windowWidth } = useWindowResize();

  const streamWidth = windowWidth * 0.6;
  const chatWidth = windowWidth * 0.25;
  const sideBarWidth = windowWidth * 0.15;
  const height = (windowWidth * 0.6) * 0.5625;

  return (
    <div className={style.habitat}>
      <NextTalkBar width={sideBarWidth} height={height} />
      <LiveStream width={streamWidth} height={height} streamId="384199109141848371717542" />
      <Chat width={chatWidth} height={height} />
    </div>
  );
}

export default Habitat;
