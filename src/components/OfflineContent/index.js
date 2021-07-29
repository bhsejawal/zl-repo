import {
  useEffect,
  useState,
  useCallback,
} from 'preact/hooks';
import { Heading, Text } from 'grommet';
import { faPlay } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useFetch from 'use-http';
import { connect } from 'react-redux';

import Tag from 'Components/HabitatCard/HabitatStatus';
import Fallback from 'Components/LiveStream/Fallback';
import Loader from 'Components/Loader';

import { buildURL } from 'Shared/fetch';

import VideoPreview from './VideoPreview';
import VideoPlayer from './VideoPlayer';

import style from './style.scss';

const COMPONENT_STATES = Object.freeze({
  INITIALIZED: 'initialized',
  PLAYING: 'playing',
  PLAYING_DONE: 'playing_done',
  LOADING: 'loading',
  NO_CONTENT: 'no_content',
});

const OfflineContent = ({
  width,
  height,
  offlineImage,
  habitatId,
}) => {
  const [state, setState] = useState(COMPONENT_STATES.LOADING);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [autoplayTime, setAutoplayTime] = useState(null);
  const [videoList, setVideoList] = useState(undefined);

  const { get, response } = useFetch(
    buildURL(`/habitats/${habitatId}/offlineVideos`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const getOfflineContent = useCallback(async () => {
    const videos = await get();
    if (response.ok && videos.length > 0) {
      setVideoList(videos);
      setState(COMPONENT_STATES.INITIALIZED);
    } else {
      setVideoList([]);
      setState(COMPONENT_STATES.NO_CONTENT);
    }
  }, []);

  useEffect(() => {
    getOfflineContent();
  }, [getOfflineContent]);

  const playNextVideo = async (videoId) => {
    let video;
    let nextVideos;
    if (!videoId) {
      [video, ...nextVideos] = videoList;
    } else {
      video = videoList.find(({ _id }) => _id === videoId);
      nextVideos = videoList.filter(({ _id }) => _id !== videoId);
    }
    setCurrentVideo(video);
    setState(COMPONENT_STATES.PLAYING);

    if (nextVideos.length === 0) {
      const videos = await get('?results=2');
      if (response.ok && videos.length > 0) {
        setVideoList(videos);
        return;
      }
    }

    setVideoList(nextVideos);
  }

  useEffect(() => {
    if (state !== COMPONENT_STATES.PLAYING_DONE) {
      return;
    }

    if (autoplayTime === 0) {
      playNextVideo();
    }

    const intervalId = setInterval(() => {
      setAutoplayTime(autoplayTime - 1);
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(intervalId);
  }, [autoplayTime, state]);

  const onVideoEndHandler = () => {
    setAutoplayTime(10);
    setState(COMPONENT_STATES.PLAYING_DONE);
  }

  return (
    <div
      className={style.offlineContentWrapper}
      style={{ width, height }}
    >
      {state === COMPONENT_STATES.NO_CONTENT && (
        <Fallback type="offline" />
      )}

      {state === COMPONENT_STATES.LOADING && (
        <Loader fill />
      )}

      {![COMPONENT_STATES.LOADING, COMPONENT_STATES.NO_CONTENT].includes(state) && (
        <div className={style.topBarContainer}>
          <Tag varient="offline" lavel="OFFLINE" className={style.offlineTag} />
          {state === COMPONENT_STATES.PLAYING_DONE && (
            <Text color="white" size="xlarge" margin={{ left: '14px' }}>
              Autoplay in
              <Text color="white" size="xlarge" weight={700}>{` ${autoplayTime}`}</Text>
            </Text>
          )}
        </div>
      )}

      {state === COMPONENT_STATES.PLAYING && (
        <VideoPlayer
          width={width}
          height={height}
          videoURL={currentVideo.videoURL}
          onEnd={onVideoEndHandler}
          videoId={currentVideo._id}
        />
      )}

      {state === COMPONENT_STATES.INITIALIZED && (
        <div onClick={() => playNextVideo()} className={style.playStateContainer}>
          <img
            src={offlineImage}
            style={{ width, height }}
            alt="offline mode preview"
          />
          <div className={style.overlay} style={{ width, height }} />
          <div className={style.playState}>
            <FontAwesomeIcon icon={faPlay} size="2x" color="white" className={style.icon} />
            <Heading level="4" color="white" margin={{ top: '52px', bottom: '0px' }}>The animals are offline.</Heading>
            <Heading level="3" color="white" margin={{ top: '21px', bottom: '0px' }}>Hit play for habitat highlights.</Heading>
          </div>
        </div>
      )}

      {state === COMPONENT_STATES.PLAYING_DONE && (
        <div className={style.videoList}>
          {videoList.map(({ previewURL, _id, title }) => (
            <VideoPreview
              previewURL={previewURL}
              onClick={playNextVideo}
              videoId={_id}
              title={title}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId, offlineImage }}}) => ({ habitatId, offlineImage }),
)(OfflineContent);
