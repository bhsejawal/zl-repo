import { h } from 'preact';
import {
  useEffect,
  useContext,
  useRef,
  useState,
  useMemo,
} from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { connect } from 'react-redux';
import { route } from 'preact-router';
import { Box, ResponsiveContext } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faInfoCircle, faPhotoVideo } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';

import { buildURL, post } from 'Shared/fetch';
import GlobalsContextProvider from "Components/GlobalsContextProvider";
import LiveStream from 'Components/LiveStream';
import Loader from 'Components/Loader';
import BroadcastWrapper from 'Components/BroadcastWrapper';
import Notifications from 'Components/Notifications';

import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { GlobalsContext } from 'Shared/context';
import { logGAEvent } from 'Shared/ga';

import { hasPermission } from 'Components/Authorize';
import AdminButton from 'Components/LiveStream/AdminButton';
import Tabs from 'Components/Tabs';
import Tab from 'Components/Tabs/Tab';
import LiveTalk from 'Components/Card/LiveTalk';
import ShareModal from 'Components/ShareModal';
import OfflineContent from 'Components/OfflineContent';
import ViewersCount from 'Components/ViewersCount';
import ClickMessageTip from 'Components/ClickMessageTip';

import ScheduleModal from './components/ScheduleModal';
import Chat from './components/Chat';
import LiveChannelsBar from './components/LiveChannelsBar';
import CardTabs from './components/CardTabs';
import TabCarousel from './components/CardTabs/tabs/index';
import StreamProfile from './components/StreamProfile';
import OnboardingModal from './components/Onboarding';
import CameraControlModal from './components/CameraControlModal';
import SmallScreenCardTabs from './components/CardTabs/Mobile';
import Album from './components/Album';
import PMMCModal from './components/PMMCModal';

import { useIsHabitatTabbed, useShowMobileControls, useWindowResize } from '../../hooks';
import { setHabitat, unsetHabitat, setHabitatProps } from './actions';
import { setUserData, setHabitatViewers, updateUserProperty } from '../../redux/actions';

import { generateTitle, getDeviceType } from '../../helpers';
import { MOBILE_CONTROLS_HEIGHT } from './constants';

import style from './style.scss';

const ChatComponent = lazy(() => import('Components/Chat'));
const PubNubWrapper = lazy(() => import('Components/PubNubWrapper'));

const PMMC_HABITAT_ID = '606c7cedaee8334640519342';

const getLiveTalkSize = (width) => {
  const device = getDeviceType();

  if (device === 'phone') {
    return width * 0.35;
  }

  if (device === 'tablet') {
    return width * 0.30;
  }

  return width * 0.25;
}

const Habitat = ({
  streamKey,
  isStreamOn,
  habitatId,
  title,
  habitatSlug,
  zooName,
  userId,
  productId,
  freeHabitat,
  userRole,
  enteredHabitat,
  hostStreamKey,
  isHostStreamOn,
  isBroadcasting,
  isAlbumClicked,
  isStreamClicked,
  setHabitatAction,
  unsetHabitatAction,
  openTermsModalAction,
  termsAccepted,
  setHabitatPropsAction,
  setUserDataAction,
  updateUserPropertyAction,
  setHabitatViewersAction,
}) => {
  // this will be undefined most of the time
  // but in case camera is changed, this value will be set by from socket message
  // and it will trigger habitat request to update it
  const [cameraId, setCameraId] = useState();
  const loadedRef = useRef(false);
  const { width: windowWidth } = useWindowResize();
  const size = useContext(ResponsiveContext);
  const { socket } = useContext(GlobalsContext);
  const pageRef = useRef();
  const [pageWidth, setPageWidth] = useState(pageRef?.current?.offsetWidth || windowWidth);
  const isTabletOrLarger = ['medium', 'large'].includes(size);
  const showMobileControls = useShowMobileControls();
  const isTabbed = useIsHabitatTabbed();
  const [showPMMCModal, setShowPPMCModal] = useState(false);

  const staticViewers = useMemo(() => Math.floor(Math.random() * 5) + 2, [habitatId]);

  useEffect(() => {
    if (habitatId === PMMC_HABITAT_ID) {
      setShowPPMCModal(true);
    }
  }, [habitatId]);

  useEffect(() => {
    if (!enteredHabitat) {
      post(buildURL('/users/enteredHabitat'))
        .then(({ user }) => {
          logGAEvent(
            'onboarding',
            'user-entered-habitat',
            getDeviceType(),
          );
          setUserDataAction(user);
        })
        .catch((error) => console.error('Failed to update user entered habitat flag', error));
    }
  }, []);

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
    const onStreamUpdated = ({ isHostStreamOn, isStreamOn }) => {
      setHabitatPropsAction({ isHostStreamOn, isStreamOn })
    };

    const onCameraChange = ({ camId }) => {
      setCameraId(camId);
    };

    const onViewersCount = ({ count }) => {
      setHabitatViewersAction(count + staticViewers);
    }

    if (socket) {
      socket.on('streamUpdated', onStreamUpdated);
      socket.on('cameraChanged', onCameraChange);
      socket.on('viewers-count', onViewersCount);
    }

    return () => {
      if (socket) {
        socket.off('streamUpdated', onStreamUpdated);
        socket.off('cameraChanged', onCameraChange);
        socket.off('viewers-count', onViewersCount);
      }
    }
  }, [socket, setHabitatPropsAction, setHabitatViewersAction]);

  const { loading: habitatLoading, error, response } = useFetch(
    buildURL(`/zoos/${zooName}/habitats/${habitatSlug}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [zooName, habitatSlug, cameraId],
  );

  loadedRef.current = loadedRef.current || !habitatLoading;

  useEffect(() => {
    if (!termsAccepted) {
      openTermsModalAction(true);
    }
  }, [openTermsModalAction, termsAccepted]);

  useEffect(() => {
    if (!loadedRef.current && habitatId) {
      unsetHabitatAction();
    } else if (response.ok && response.data) {
      setHabitatAction(response.data);
    } else if (response.status === 404) {
      route('/404', true);
    }
  }, [
    habitatId,
    response,
    response.ok,
    response.data,
    setHabitatAction,
    unsetHabitatAction,
  ]);

  useEffect(() => () => unsetHabitatAction(), [unsetHabitatAction]);

  useEffect(() => {
    if (title) {
      document.title = generateTitle(`${title} | Habitat`);
    }
  }, [title]);

  useEffect(() => {
    // this will update page width after habitat is set or when window width changes
    // because scroll shows before habitat is loaded but page width is not updated
    // therefore calculations are not accurate
    if (habitatId) {
      const width = pageRef?.current?.offsetWidth;
      if (width !== pageWidth) {
        setPageWidth(width)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitatId, windowWidth]);

  if ((userRole === 'user' && !productId) || !habitatId) {
    return null;
  }

  if (userRole === 'user' && productId === 'FREEMIUM' && habitatId !== freeHabitat) {
    route('/plans', true);
  }

  if (error) {
    // TODO: we need UI for this
    return (
      <Box fill align="center" justify="center">
        <p>There was an error. Please try again</p>
      </Box>
    );
  }

  const sideBarWidth = 50;
  const chatWidth = 345;
  const maxStreamWidth = 1440 - sideBarWidth - chatWidth;
  const maxStreamHeight = maxStreamWidth * 0.5625;
  const calcStreamWidth = isTabbed ? windowWidth : (pageWidth - sideBarWidth - chatWidth);
  const streamWidth = Math.min(maxStreamWidth, calcStreamWidth);
  const height = Math.min(maxStreamHeight, streamWidth * 0.5625);
  const topSectionHeight = height + (showMobileControls && isStreamOn ? MOBILE_CONTROLS_HEIGHT : 0);
  const livetalkWidth = getLiveTalkSize(streamWidth);

  const onTabChange = ({ label }) => {
    logGAEvent(
      'Tab-Navigation-Mobile',
      label,
      habitatId,
    );

    if (label === 'Album' && !isAlbumClicked) {
      post(buildURL('users/steps'), { step: 'isAlbumClicked', value: true })
        .then((data) => updateUserPropertyAction(data))
        .catch((err) => console.error('Error while updating album click indicator', err));
    }
  }

  return (
    <div className={style.page} ref={pageRef}>
      {/* using habitatId to prevent render where we recieve data,
      loading becomes false, but habitat data is set later in useEffect */}
      {(!loadedRef.current || !habitatId) ? (
        <Box fill align="center" justify="center">
          <Loader />
        </Box>
      ) : (
        <>
          <div
            className={style.topSection}
            style={{ height: topSectionHeight }}
          >
            {!isTabbed && <LiveChannelsBar width={sideBarWidth} height={height} />}
            <div className={style.livestreamWrapper} style={{ minWidth: streamWidth }}>
              {!isStreamOn && (
                <>
                  <OfflineContent width={streamWidth} height={height} />
                  {(hasPermission('habitat:edit-stream') || hasPermission('habitat:switch-stream')) && <AdminButton />}
                </>

              )}
              {isStreamOn && <LiveStream
                width={streamWidth}
                height={height}
                streamId={streamKey}
                interactive
                mode="stream"
                isStreamOn={isStreamOn}
              />}

              {isStreamOn && isTabbed && (<ViewersCount />)}

              {hasPermission('habitat:broadcast') && hostStreamKey && (!isHostStreamOn || isBroadcasting) && (
                <BroadcastWrapper
                  size={livetalkWidth}
                />
              )}

              {hostStreamKey && isHostStreamOn && !isBroadcasting && (
                <LiveTalk
                  streamId={hostStreamKey}
                  size={livetalkWidth}
                />
              )}
            </div>
            {!isTabbed && <Chat width={chatWidth} height={height} showHeader />}
          </div>

          <div className={style.contentSection} style={{ height: `calc((var(--vh) * 100) - var(--headerHeight) - ${topSectionHeight}px)` }}>
            <Tabs show={isTabbed} onChange={onTabChange}>
              <Tab label="Explore" icon={<FontAwesomeIcon size="lg" icon={faInfoCircle} />}>
                <div className={style.middleSection}>
                  <StreamProfile />
                  {isTabletOrLarger ? <TabCarousel /> : <SmallScreenCardTabs />}
                </div>

                <div className={style.bottomSection}>
                  {isTabletOrLarger && <CardTabs />}
                </div>
              </Tab>

              <Tab label="Chat" icon={<FontAwesomeIcon size="lg" icon={faComment} />}>
                <Box fill direction="column" justify="center">
                  <Suspense fallback={<Loader />}>
                    <ChatComponent channelId={habitatId} />
                  </Suspense>
                </Box>
              </Tab>

              <Tab
                label="Album"
                icon={
                  <ClickMessageTip
                    align={{ bottom: 'top' }}
                    disable={isAlbumClicked || !isStreamClicked}
                    text="View photos and clips">
                    <FontAwesomeIcon
                      className={style.icon}
                      icon={faPhotoVideo}
                      style={{ zIndex: '1' }}
                    />
                  </ClickMessageTip>
                }
              >
                <Box fill direction="column" justify="start" pad="20px 0">
                  <Suspense fallback={<Loader />}>
                    <Album tab />
                  </Suspense>
                </Box>
              </Tab>
            </Tabs>
          </div>

          <OnboardingModal />
          <ShareModal />
          <ScheduleModal />
          <CameraControlModal />
          {showPMMCModal && <PMMCModal onClose={() => setShowPPMCModal(false)} />}
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
    mainStream: { interactionState: { isBroadcasting } },
    user: {
      userId,
      termsAccepted = false,
      enteredHabitat,
      role: userRole,
      isAlbumClicked,
      isStreamClicked,
      subscription: {
        productId,
        freeHabitat,
      } = {},
    },
  }) => ({
    streamKey,
    habitatId,
    title,
    userId,
    isStreamOn,
    termsAccepted,
    hostStreamKey,
    isHostStreamOn,
    enteredHabitat,
    isBroadcasting,
    productId,
    freeHabitat,
    userRole,
    isAlbumClicked,
    isStreamClicked,
  }),
  {
    setHabitatAction: setHabitat,
    unsetHabitatAction: unsetHabitat,
    openTermsModalAction: openTermsModal,
    setHabitatPropsAction: setHabitatProps,
    setUserDataAction: setUserData,
    setHabitatViewersAction: setHabitatViewers,
    updateUserPropertyAction: updateUserProperty,
  },
)(Habitat);

const HabitatWrapper = ({ matches: { zooName, habitatSlug } }) => (
  <GlobalsContextProvider>
    {typeof window !== 'undefined' && (
      <Suspense fallback={<Loader />}>
        <PubNubWrapper>
          <ConnectedHabitat zooName={zooName} habitatSlug={habitatSlug} />
        </PubNubWrapper>
      </Suspense>
    )}
    <Notifications />
  </GlobalsContextProvider>
);

export default HabitatWrapper;
