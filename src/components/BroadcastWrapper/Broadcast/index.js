import { h } from 'preact';
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'preact/hooks';

import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Text,
  Drop,
} from 'grommet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalStream, faVideo, faMicrophone } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';
import { format } from "date-fns";

import { wsMessages } from 'Components/LiveStream/helpers/constants';
import { useWebRTCStream } from 'Components/LiveStream/hooks/useWebRTCStream';
import { GlobalsContext } from 'Shared/context';
import { PrimaryButton } from 'Components/Buttons';
import RoundButton from 'Components/RoundButton';
import PreviewTag from './PreviewTag';
import LiveTag from './LiveTag';
import Fallback from './Fallback';

import { useUpcomingTalks } from '../../../routes/habitat/hooks';
import { toggleIsBroadcasting } from '../../../redux/actions';

import style from './style.scss';

const {
  PLAY_STARTED,
  PUBLISH_STARTED,
  ERROR,
  STREAM_IN_USE,
  PUBLISH_TIMEOUT,
} = wsMessages;

const Broadcast = ({
  userId,
  hostStreamKey,
  isHostStreamOn,
  resetBroadcastContainer,
  habitatId,
  toggleIsBroadcastingAction,
}) => {
  const { socket } = useContext(GlobalsContext)
  const [showMenu, setShowMenu] = useState(false);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef();
  const videoRef = useRef();
  const { upcoming = [] } = useUpcomingTalks(habitatId, 1);
  const nextTalk = upcoming[0];
  const buttonMessage = isBroadcasting ? 'End Stream' : 'Go Live'

  const {
    streamStatus,
    startPublishing,
    stopPublishing,
    availableDevices,
    switchAudioInput,
    switchVideoInput,
    removeWebRTCAdaptor,
    initializeAdapter,
  } = useWebRTCStream(hostStreamKey, isHostStreamOn, videoRef, 'broadcaster');

  const toggleBroadcast = (broadcastStatus) => {
    if (broadcastStatus) {
      setIsLoading(true);
      toggleIsBroadcastingAction();
      startPublishing()
      socket.emit('viv_started', { streamId: hostStreamKey, userId});
    } else {
      toggleIsBroadcastingAction();
      stopPublishing();
      removeWebRTCAdaptor(hostStreamKey);
      resetBroadcastContainer();
    }
  }

  useEffect(() => {
    if (streamStatus === PUBLISH_STARTED) {
      setShowMenu(false)
      setIsLoading(false);
      setIsBroadcasting(true);
      return;
    }

    if (streamStatus === PUBLISH_TIMEOUT) {
      removeWebRTCAdaptor(hostStreamKey);
      toggleIsBroadcastingAction();
      resetBroadcastContainer();
    }

    if (isBroadcasting) {
      setIsBroadcasting(false);
    }
  }, [
    streamStatus,
    setIsBroadcasting,
    isBroadcasting,
    toggleIsBroadcastingAction,
    resetBroadcastContainer,
    removeWebRTCAdaptor,
    hostStreamKey,
  ]);

  useEffect(() => {
    if (hostStreamKey && !isHostStreamOn) {
      initializeAdapter();
    }
  }, [hostStreamKey, isHostStreamOn, initializeAdapter])

  const videoSources = useMemo(() => availableDevices.filter(({ kind }) => (kind === 'videoinput')), [availableDevices]);
  const audioSources = useMemo(() => availableDevices.filter(({ kind }) => (kind === 'audioinput')), [availableDevices]);

  useEffect(() => {
    if (availableDevices.length) {
      const [{ deviceId: currentVideoSource } = {}] = videoSources.filter(
        ({ selected }) => (selected === true),
      );
      const [{ deviceId: currentAudioSource }] = audioSources.filter(
        ({ selected }) => (selected === true),
      );
      setSelectedAudioDevice(currentAudioSource);
      setSelectedVideoDevice(currentVideoSource);
    }
  }, [availableDevices, videoSources, audioSources, hostStreamKey]);

  useEffect(() => () => removeWebRTCAdaptor(hostStreamKey), [removeWebRTCAdaptor, hostStreamKey]);

  const selectNewSource = (evt) => {
    const selectedSourceId = evt.target.value;
    const { kind } = availableDevices.find((source) => source.deviceId === selectedSourceId);

    if (kind === 'audioinput') {
      switchAudioInput(selectedSourceId);
      setSelectedAudioDevice(selectedSourceId);
    } else {
      switchVideoInput(selectedSourceId);
      setSelectedVideoDevice(selectedSourceId);
    }
  };

  if (!hostStreamKey) {
    return null;
  }

  return (
    <Box>
      <Box flex="grow" fill justify="center" align="center">
        <Card
          elevation="none" style={{ position: 'relative', borderRadius: '5px'}}
          width="auto"
          height={{ min: !nextTalk && [PLAY_STARTED, PUBLISH_STARTED].includes(streamStatus) ? `${videoRef?.current?.offsetHeight}px` : '140px' }}
        >
          <CardBody flex="grow">
            {/* Replace the livetag date with a date from the livetalks */}
            {![PLAY_STARTED, PUBLISH_STARTED, ERROR, STREAM_IN_USE].includes(streamStatus) && (
              <Box className={style.fallbackContainer}>
                <Fallback type="loading" />
              </Box>
            )}
            {[ERROR, STREAM_IN_USE].includes(streamStatus) && (
              <Box
                className={style.fallbackContainer}
                height={nextTalk ? `${videoRef?.current?.offsetHeight}px` : '140px'}
              >
                <Fallback type="error" text={ streamStatus === ERROR ? 'Please try again.' : 'Someone is already streaming.'} />
              </Box>
            )}
            {[PLAY_STARTED, PUBLISH_STARTED].includes(streamStatus) && (
              <Box className={style.controlContainer} ref={buttonRef}>
                <RoundButton
                  onClick={() => setShowMenu(!showMenu)}
                  className={isBroadcasting ? style.online : style.offline}
                  width="35"
                  color="white"
                >
                  <FontAwesomeIcon icon={faSignalStream} size="lg" />
                </RoundButton>
              </Box>
            )}
            {streamStatus === PUBLISH_STARTED && nextTalk && (
              <LiveTag endTime={nextTalk.stopTime} />
            )}

            {streamStatus !== PUBLISH_STARTED && <PreviewTag />}
            <video
              autoPlay
              muted
              ref={videoRef}
              style={{ maxHeight: '140px', maxWidth: '240px', width: '100%' }}
            />
          </CardBody>
          {nextTalk && (
          <CardFooter
            background="#24412B"
            direction="column"
            justify="center"
            align="center"
            pad={{ horizontal: '12px', vertical: '6px' }}
            gap="xxsmall"
          >
            <Text
              size="8px"
              textAlign="center"
              style={{
                textTransform: 'uppercase',
                lineHeight: "10px",
                letterSpacing: ".5px",
              }}
            >
              {nextTalk.title}
            </Text>
            <Text
              align="center"
              size="9px"
              weight={400}
              style={{ lineHeight: '18px' }}
            >
              {`Starts at ${format(nextTalk.startTime, 'HH:mm aa')}`}
            </Text>
          </CardFooter>
          )}
        </Card>
      </Box>
      {showMenu && (
        <Drop
          align={{ top: "top", right: "left" }}
          target={buttonRef.current}
          margin={{ left: "-5px", top: "5px" }}
          className={style.controls}
        >
          <Box width="240px" background="white" style={{ borderRadius: '5px' }} pad="small" flex="grow">
            <span className={style.title}>Stream Setup</span>
            <Box direction="row" pad={{vertical: '7px' }} align="center">
              <FontAwesomeIcon icon={faVideo} size="1x" style={{ minWidth: '20px' }} color="#CDCDCD" />
              <Box margin={{ left: "14px"}} flex="grow">
                <select value={selectedVideoDevice} onChange={selectNewSource}>
                  {videoSources.map((source) => (
                    <option value={source.deviceId} key={source.deviceId}>{source.label}</option>
                  ))}
                </select>
              </Box>
            </Box>
            <Box direction="row" pad={{vertical: '7px' }} align="center" flex="grow">
              <FontAwesomeIcon icon={faMicrophone} size="1x" style={{ minWidth: '20px' }} color="#CDCDCD" />
              <Box margin={{ left: "14px"}} flex="grow">
                <select value={selectedAudioDevice} onChange={selectNewSource}>
                  {audioSources.map((source) => (
                    <option value={source.deviceId} key={source.deviceId}>{source.label}</option>
                  ))}
                </select>
              </Box>
            </Box>
            <Box margin={{ top: '15px' }} basis="2/3" alignSelf="start">
              <PrimaryButton
                size="medium"
                label={isLoading ? 'Loading...' : buttonMessage}
                onClick={() => toggleBroadcast(!isBroadcasting)}
                className={isBroadcasting ? style.online : style.offline}
                disabled={!selectedAudioDevice || !selectedVideoDevice || isLoading}
              />
            </Box>
          </Box>
        </Drop>
      )}
    </Box>
  );
};

export default connect((
  {
    user: { userId },
    habitat: { habitatInfo: { hostStreamKey, isHostStreamOn, _id: habitatId }},
  },
) => ({
  userId,
  hostStreamKey,
  isHostStreamOn,
  habitatId,
}), {
  toggleIsBroadcastingAction: toggleIsBroadcasting,
})(Broadcast);
