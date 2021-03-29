import { h } from 'preact';
import {
  useRef,
  useState,
  useEffect,
  useMemo,
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

import { useWebRTCStream } from 'Components/LiveStream/hooks/useWebRTCStream';
import RoundButton from 'Components/RoundButton';
import { PrimaryButton } from 'Components/Buttons';
import PreviewTag from './PreviewTag';
import LiveTag from './LiveTag';

import style from './style.scss';

const Broadcast = ({ hostStreamKey }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const buttonRef = useRef();
  const videoRef = useRef();

  const {
    streamStatus,
    startPublishing,
    stopPublishing,
    availableDevices,
    switchAudioInput,
    switchVideoInput,
    removeWebRTCAdaptor,
  } = useWebRTCStream(hostStreamKey, videoRef, 'broadcaster');

  const toggleBroadcast = (broadcastStatus) => {
    if (broadcastStatus) {
      startPublishing()
      try {
        const streamingData = {
          hostStreamKey,
          videoDeviceId: selectedVideoDevice,
          audioDeviceId: selectedAudioDevice,
        };
        sessionStorage.setItem('userStreamingData', JSON.stringify(streamingData));
      } catch (err) {
        console.error('Error trying to set sessionstorage data', err);
      }
    } else {
      stopPublishing()
      try {
        sessionStorage.removeItem('userStreamingData');
      } catch (err) {
        console.error('Error trying to set sessionstorage data', err);
      }
    }
    setIsBroadcasting(broadcastStatus);
  }

  useEffect(() => {
    if (streamStatus !== 'publish_started' && isBroadcasting) {
      startPublishing();
    }
  }, [streamStatus, isBroadcasting, startPublishing])

  const videoSources = useMemo(() => availableDevices.filter(({ kind }) => (kind === 'videoinput')), [availableDevices]);
  const audioSources = useMemo(() => availableDevices.filter(({ kind }) => (kind === 'audioinput')), [availableDevices]);
  const streamData = useMemo(() => JSON.parse(sessionStorage.getItem('userStreamingData')), []);

  useEffect(() => {
    if (availableDevices.length) {
      const [{ deviceId: currentVideoSource } = {}] = videoSources.filter(
        ({ selected }) => (selected === true),
      );
      const [{ deviceId: currentAudioSource }] = audioSources.filter(
        ({ selected }) => (selected === true),
      );
      if (streamData) {
        const { videoDeviceId, audioDeviceId, hostStreamKey: savedKey } = streamData;
        switchVideoInput(videoDeviceId);
        switchAudioInput(audioDeviceId);
        setSelectedVideoDevice(videoDeviceId);
        setSelectedAudioDevice(audioDeviceId);
        if (hostStreamKey === savedKey) {
          setIsBroadcasting(true);
        }
      } else {
        setSelectedAudioDevice(currentAudioSource);
        setSelectedVideoDevice(currentVideoSource);
      }
    }
  }, [availableDevices, videoSources, audioSources, hostStreamKey]);

  useEffect(() => () => removeWebRTCAdaptor(), [removeWebRTCAdaptor]);

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
        <Card elevation="none" style={{ position: 'relative', borderRadius: '5px'}} width="auto" height={{ min: "140px" }}>
          <CardBody flex="grow">
            {/* Replace the livetag date with a date from the livetalks */}
            {isBroadcasting ? <LiveTag endTime={new Date('2021-03-31T18:30:00')} /> : <PreviewTag />}
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
            <video
              autoPlay
              muted
              ref={videoRef}
              style={{ height: '140px' }}
            />
          </CardBody>
          {/* TODO: We need to get this from the backend, if there's no talk, we hide this */}
          <CardFooter
            background="#24412B"
            direction="column"
            justify="center"
            align="center"
            pad="small"
            gap="xxsmall"
          >
            <Text align="center" size="10px" weight={500}>MAKING LUNCH WITH THE NUTRITIONIST</Text>
            <Text size="12px">Keeper Karen, Toronto Zoo</Text>
          </CardFooter>
        </Card>
      </Box>
      {showMenu && (
        <Drop
          align={{ top: "top", right: "left" }}
          target={buttonRef.current}
          margin={{ left: "-5px", top: "5px" }}
        >
          <Box width="240px" background="white" style={{ borderRadius: '5px' }} pad="small" >
            <Text size="14px">Stream Setup</Text>
            <Box direction="row" pad={{vertical: "xsmall", horizontal: "small" }} align="center">
              <FontAwesomeIcon icon={faVideo} size="1x" style={{ minWidth: '20px' }} color="#CDCDCD" />
              <Box margin={{ left: "5px"}}>
                <select value={selectedVideoDevice} onChange={selectNewSource}>
                  {videoSources.map((source) => (
                    <option value={source.deviceId} key={source.deviceId}>{source.label}</option>
                  ))}
                </select>
              </Box>
            </Box>
            <Box direction="row" pad={{vertical: "xsmall", horizontal: "small" }} align="center">
              <FontAwesomeIcon icon={faMicrophone} size="1x" style={{ minWidth: '20px' }} color="#CDCDCD" />
              <Box margin={{ left: "5px"}}>
                <select value={selectedAudioDevice} onChange={selectNewSource}>
                  {audioSources.map((source) => (
                    <option value={source.deviceId} key={source.deviceId}>{source.label}</option>
                  ))}
                </select>
              </Box>
            </Box>
            <Box margin={{ top: "xsmall" }} pad={{ horizontal: "small" }} basis="2/3" alignSelf="end">
              <PrimaryButton
                size="medium"
                label={`${isBroadcasting ? 'End Stream' : 'Go Live'}`}
                onClick={() => toggleBroadcast(!isBroadcasting)}
                className={isBroadcasting ? style.online : style.offline}
                disabled={!selectedAudioDevice || !selectedVideoDevice}
              />
            </Box>
          </Box>
        </Drop>
      )}
    </Box>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { hostStreamKey }} }) => ({ hostStreamKey }),
)(Broadcast);
