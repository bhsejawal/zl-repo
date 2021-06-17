import { h } from 'preact';
import { useEffect, useContext, useRef } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { connect } from 'react-redux';
import { route } from 'preact-router';
import { Box, ResponsiveContext } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import GlobalsContextProvider from "Components/GlobalsContextProvider";
import LiveStream from 'Components/LiveStream';
import Loader from 'Components/Loader';
import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { GlobalsContext } from 'Shared/context';

import Tabs from 'Components/Tabs';
import Tab from 'Components/Tabs/Tab';
import LiveTalk from 'Components/Card/LiveTalk';
import Chat from './components/Chat';
import LiveChannelsBar from './components/LiveChannelsBar';
import CardTabs from './components/CardTabs';
import StreamProfile from './components/StreamProfile';
import OnboardingModal from './OnboardingModal';
import SmallScreenCardTabs from './components/CardTabs/Mobile';
import ShareModal from './components/ShareModal';

import { useIsHabitatTabbed, useWindowResize } from '../../hooks';
import { setHabitat, unsetHabitat, setHabitatProps } from './actions';
import { generateTitle } from '../../helpers';
import { MOBILE_CONTROLS_HEIGHT } from './constants';

import style from './style.scss';

const ChatComponent = lazy(() => import('Components/Chat'));

const maxStreamWidth = 1280;
const maxStreamHeight = 720;

const Habitat = ({
  streamKey,
  isStreamOn,
  habitatId,
  title,
  habitatSlug,
  zooName,
  userId,
  hostStreamKey,
  isHostStreamOn,
  setHabitatAction,
  unsetHabitatAction,
  openTermsModalAction,
  termsAccepted,
  setHabitatPropsAction,
}) => {
  const { width: windowWidth } = useWindowResize();
  const size = useContext(ResponsiveContext);
  const { socket } = useContext(GlobalsContext);
  const pageRef = useRef();
  const isTabletOrLarger = ['medium', 'large'].includes(size);
  const isTabbed = useIsHabitatTabbed();
  const pageWidth = pageRef?.current?.offsetWidth || windowWidth;

  useEffect(() => {
    if (socket && userId && habitatId) {
      socket.emit('joinRoom', { room: habitatId, userId });
    }
    return () => {
      if (socket && habitatId) {
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
      document.title = generateTitle(`${title} | Habitat`);
    }
  }, [title]);

  if (error) {
    // TODO: we need UI for this
    return (
      <Box fill align="center" justify="center">
        <p>There was an error. Please try again</p>
      </Box>
    );
  }

  const sideBarWidth = 84;
  const chatWidth = 285;
  const calcStreamWidth = isTabbed ? windowWidth : (pageWidth - sideBarWidth - chatWidth);
  const streamWidth = Math.min(maxStreamWidth, calcStreamWidth);
  const height = Math.min(maxStreamHeight, streamWidth * 0.5625);
  const topSectionHeight = height + (isTabletOrLarger ? 0 : MOBILE_CONTROLS_HEIGHT);

  return (
    <div className={style.page} ref={pageRef}>
      {/* using habitatId to prevent render where we recieve data,
      loading becomes false, but habitat data is set later in useEffect */}
      {(loading || !habitatId) ? (
        <Box fill align="center" justify="center">
          <Loader />
        </Box>
      ) : (
        <>
          <div
            className={style.topSection}
            style={{ height: topSectionHeight, maxHeight: topSectionHeight }}
          >
            {!isTabbed && <LiveChannelsBar width={sideBarWidth} height={height} />}
            <div className={style.livestreamWrapper}>
              <LiveStream
                width={streamWidth}
                height={height}
                streamId={streamKey}
                interactive
                mode="stream"
                isStreamOn={isStreamOn}
              />
              {isTabbed && hostStreamKey && isHostStreamOn && <LiveTalk streamId={hostStreamKey} />}
            </div>
            {!isTabbed && <Chat width={chatWidth} height={height} />}
          </div>

          <div style={{ height: `calc(100vh - var(--headerHeight) - ${height + (isTabletOrLarger ? 0 : MOBILE_CONTROLS_HEIGHT)}px)` }}>
            <Tabs show={isTabbed}>
              <Tab label="Explore" icon={<FontAwesomeIcon size="lg" icon={faInfoCircle} />}>
                <div className={style.middleSection}>
                  <StreamProfile />
                </div>

                <div className={style.bottomSection}>
                  {isTabletOrLarger
                    ? <CardTabs />
                    : <SmallScreenCardTabs />}
                </div>
              </Tab>

              <Tab label="Chat" icon={<FontAwesomeIcon size="lg" icon={faComment} />}>
                <Box fill direction="column" justify="center">
                  <Suspense fallback={<Loader />}>
                    <ChatComponent />
                  </Suspense>
                </Box>
              </Tab>
            </Tabs>
          </div>

          <OnboardingModal />
          <ShareModal />
        </>
      )}
    </div>
  );
}

const ConnectedHabitat = connect(
  ({
    habitat: {
      habitatInfo: {
        streamKey,
        _id: habitatId,
        title,
        isStreamOn,
        hostStreamKey,
        isHostStreamOn,
      },
    },
    user: { userId, termsAccepted = false },
  }) => ({
    streamKey,
    habitatId,
    title,
    userId,
    isStreamOn,
    termsAccepted,
    hostStreamKey,
    isHostStreamOn,
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
    <ConnectedHabitat zooName={zooName} habitatSlug={habitatSlug} />
  </GlobalsContextProvider>
);

export default HabitatWrapper;
