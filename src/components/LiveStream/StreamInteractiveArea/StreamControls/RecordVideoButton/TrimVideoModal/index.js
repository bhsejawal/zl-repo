import { connect} from 'react-redux';
import { isEmpty } from 'lodash-es';
import { useEffect, useState, useRef } from 'preact/hooks';
import {
  Box,
  Layer,
  Text,
  TextInput,
} from 'grommet';
import useFetch from 'use-http';

import Header from 'Components/modals/Header';
import RangeInput from 'Components/RangeInput';
import ErrorModal from 'Components/modals/Error';
import { getTimeString } from 'Components/RangeInput/helper';
import { PrimaryButton } from 'Components/Buttons';
import { API_BASE_URL } from 'Shared/fetch';
import ShareContent from './ShareContent';
import LoadingContent from './LoadingContent';

import style from './style.scss';

const TrimVideoModal = ({ onClose, streamId, habitatId }) => {
  const [videoData, setVideoData] = useState({});
  const [showError, setShowError] = useState(false);
  const [trimmedVideoData, setTrimmedVideoData] = useState({});
  const [range, setRange] = useState([0, 30]);
  const [title, setTitle] = useState('');
  const videoRef = useRef();

  const { data, error, post } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const {
    data: trimData,
    error: trimError,
    post: trimPost,
    loading: trimLoading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    post('/videos/clip', { streamId });
  }, [post, streamId]);

  useEffect(() => {
    if (data?.videoURL && data?.duration) {
      setVideoData(data);
    }

    if (error) {
      console.error('Error While requesting stream clip', error);
      setShowError(true);
    }
  }, [data, error]);

  useEffect(() => {
    if (trimData?.video) {
      setTrimmedVideoData(trimData.video);
    }

    if (trimError) {
      console.error('Error while trimming video', trimError);
      setShowError(true);
    }
  }, [trimData, trimError]);

  const rangeChangeHandler = ([min, max]) => {
    videoRef.current.currentTime = min;
    setRange([min, max]);
  };

  const trimVideoHandler = () => {
    if (title) {
      const [min, max] = range;

      trimPost('/videos/trim', {
        videoURL: data.videoURL,
        startTime: getTimeString(min),
        endTime: getTimeString(max),
        streamId,
        habitatId,
        title,
      });
    }
  };

  return (
    <Layer position="center" onClickOutside={onClose}>
      <Box width="960px" height={{ min: '530px' }}>
        <Header onClose={onClose}>
          Zoolife Moments
        </Header>

        {isEmpty(videoData) && (
          <LoadingContent />
        )}

        {!isEmpty(videoData) && !trimmedVideoData?.videoURL && (
          <Box className={style.contentContainer}>
            <Box className={style.leftSection}>
              <div className={style.videoWrapper}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video ref={videoRef} src={videoData.videoURL} controls />
              </div>
              <RangeInput onChange={rangeChangeHandler} initRange={range} />
            </Box>
            <Box className={style.rightSection}>
              <Text size="xlarge">
                Capture clips of your favorite animals to share with friends
                and the Zoolife community.
              </Text>
              <TextInput
                placeholder="Title this moment (required)"
                value={title}
                onChange={({ target: { value }}) => setTitle(value)}
                className={style.input}
              />
              <PrimaryButton
                label="Save & Share"
                loading={trimLoading}
                onClick={trimVideoHandler}
                disabled={!title}
                className={style.submit}
              />
            </Box>
          </Box>
        )}

        {trimmedVideoData?.videoURL && (
          <ShareContent
            videoURL={trimmedVideoData.videoURL}
            htmlURL={trimmedVideoData.htmlURL}
            title={trimmedVideoData.title}
            mediaId={trimmedVideoData._id}
          />
        )}
      </Box>
      {showError && <ErrorModal onClose={() => setShowError(false)} />}
    </Layer>
  )
};

export default connect(
  ({ habitat: { habitatInfo: { streamKey, _id }}}) => ({ streamId: streamKey, habitatId: _id }),
)(TrimVideoModal);
