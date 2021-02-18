import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';

import LiveStream from 'Components/LiveStream';
import GlobalsContextProvider from "Components/GlobalsContextProvider";
import Header from 'Components/Header';

import Chat from './components/Chat';
import NextTalkBar from './components/NextTalkBar';
import CardTabs from './components/CardTabs';
import StreamProfile from './components/StreamProfile';

import { useWindowResize } from '../../hooks';

import { fetchHabitatSettings } from './actions';

import style from './style.scss';

const Habitat = ({ isFetching, fetchHabitatSettingsAction }) => {
  const { width: windowWidth } = useWindowResize();

  useEffect(() => {
    fetchHabitatSettingsAction('60257af51cf87a9d09c5dbd9');
  }, [fetchHabitatSettingsAction]);

  const sideBarWidth = 84;
  const chatWidth = 285;
  const streamWidth = windowWidth - sideBarWidth - chatWidth;
  const height = streamWidth * 0.5625;

  if (isFetching) {
    // This should use the lottie loader as we implement it
    return null;
  }

  return (
    <GlobalsContextProvider>
      <Header />
      <div className={style.habitat} style={{ paddingTop: '60px' }}>
        <div className={style.topSection} style={{ height, maxHeight: height }}>
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

export default connect((
  { habitat: { habitatInfo: { isFetching} } },
) => ({ isFetching }), {
  fetchHabitatSettingsAction: fetchHabitatSettings,
})(Habitat);
