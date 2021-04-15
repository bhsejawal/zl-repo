import { h } from 'preact';
import { useEffect, useContext } from 'preact/hooks';
import { connect } from 'react-redux';
import useFetch from 'use-http';
import { route } from 'preact-router';

import { buildURL } from 'Shared/fetch';
import GlobalsContextProvider from "Components/GlobalsContextProvider";
import LiveStream from 'Components/LiveStream';
import Header from 'Components/Header';
import Loader from 'Components/async/Loader';
import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { GlobalsContext } from 'Shared/context';

import Chat from './components/Chat';
import NextTalkBar from './components/NextTalkBar';
import CardTabs from './components/CardTabs';
import StreamProfile from './components/StreamProfile';
import OnboardingModal from './OnboardingModal';

import { useWindowResize } from '../../hooks';
import { setHabitat, unsetHabitat, setHabitatProps } from './actions';
import { generateTitle } from '../../helpers';

import style from './style.scss';

const maxStreamWidth = 1280;
const maxStreamHeight = 720;

const Habitat = ({
  streamKey,
  habitatId,
  title,
  habitatSlug,
  zooName,
  userId,
  setHabitatAction,
  unsetHabitatAction,
  openTermsModalAction,
  termsAccepted,
  setHabitatPropsAction,
}) => {
  const { width: windowWidth } = useWindowResize();
  const { socket } = useContext(GlobalsContext);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', { room: habitatId, userId });
    }
    return () => {
      if (socket) {
        socket.emit('leaveRoom', { room: habitatId });
      }
    }
  }, [socket, habitatId, userId]);

  useEffect(() => {
    if (socket) {
      socket.on('streamUpdated', ({ isHostStreamOn, isStreamOn }) => setHabitatPropsAction({ isHostStreamOn, isStreamOn }));
    }
    return () => {
      if (socket) {
        socket.off('streamUpdated', ({ isHostStreamOn, isStreamOn }) => setHabitatPropsAction({ isHostStreamOn, isStreamOn }));
      }
    }
  }, [socket, setHabitatPropsAction]);

  const { loading, error, response } = useFetch(
    buildURL(`/zoos/${zooName}/habitats/${habitatSlug}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [zooName, habitatSlug],
  );

  useEffect(() => {
    if (!termsAccepted) {
      openTermsModalAction(true);
    }
  }, [openTermsModalAction, termsAccepted]);

  useEffect(() => {
    if (loading && habitatId) {
      unsetHabitatAction();
    } else if (response.ok && response.data) {
      setHabitatAction(response.data);
    } else if (response.status === 404) {
      route('/404', true);
    }
  }, [
    loading,
    habitatId,
    response,
    response.ok,
    response.data,
    setHabitatAction,
    unsetHabitatAction,
  ]);

  useEffect(() => () => {
    unsetHabitatAction();
  }, [unsetHabitatAction]);

  useEffect(() => {
    if (title) {
      document.title = generateTitle(`${title} - Habitat`);
    }
  }, [title]);

  const sideBarWidth = 84;
  const chatWidth = 285;
  const calcStreamWidth = windowWidth - sideBarWidth - chatWidth;
  const streamWidth = calcStreamWidth > maxStreamWidth ? maxStreamWidth : calcStreamWidth;
  const height = streamWidth * 0.5625 > maxStreamHeight ? maxStreamHeight : streamWidth * 0.5625;

  // TODO: there's a minor problem with this approach which should be fixed
  // curretnly when loading changes to "false", habitat data is still not there
  // it's present on the next update, so we have one excess render
  // which we should avoid to have better rendering performance
  if (loading) {
    return <Loader />;
  }

  if (error) {
    // TODO: we need UI for this
    <p>There was an error. Please try again</p>
  }

  return (
    <>
      <div className={style.habitat} style={{ paddingTop: '60px' }}>
        <div className={style.topSection} style={{ height, maxHeight: height }}>
          <NextTalkBar width={sideBarWidth} height={height} />
          <LiveStream
            width={streamWidth}
            height={height}
            streamId={streamKey}
            interactive
            mode="stream"
          />
          <Chat width={chatWidth} height={height} />
        </div>

        <div className={style.middleSection}>
          <StreamProfile />
        </div>

        <div className={style.bottomSection}>
          <CardTabs />
        </div>
      </div>
      <OnboardingModal />
    </>
  );
}

const ConnectedHabitat = connect(
  ({
    habitat: {
      habitatInfo: {
        streamKey,
        _id: habitatId,
        title,
      },
    },
    user: { userId, termsAccepted = false },
  }) => ({
    streamKey,
    habitatId,
    title,
    userId,
    termsAccepted,
  }),
  {
    setHabitatAction: setHabitat,
    unsetHabitatAction: unsetHabitat,
    openTermsModalAction: openTermsModal,
    setHabitatPropsAction: setHabitatProps,
  },
)(Habitat);

const HabitatWrapper = ({ matches: { zooName, habitatSlug } }) => (
  <GlobalsContextProvider>
    <Header />
    <ConnectedHabitat zooName={zooName} habitatSlug={habitatSlug} />
  </GlobalsContextProvider>
);

export default HabitatWrapper;
