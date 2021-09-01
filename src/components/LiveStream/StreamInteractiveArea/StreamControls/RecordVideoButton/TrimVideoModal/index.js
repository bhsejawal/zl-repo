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
import classnames from 'classnames';

import { logGAEvent } from 'Shared/ga';
import Header from 'Components/modals/Header';
import RangeInput from 'Components/RangeInput';
import ErrorModal from 'Components/modals/Error';
import { getTimeString } from 'Components/RangeInput/helper';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import { setShareModalData } from 'Components/ShareModal/actions';

import { API_BASE_URL } from 'Shared/fetch';
import LoadingContent from './LoadingContent';

import style from './style.scss';

const TrimVideoModal = ({
  onClose,
  streamId,
  habitatId,
  slug,
  setShareModalDataAction,
}) => {
  const [videoData, setVideoData] = useState({});
  const [showError, setShowError] = useState(false);
  const [range, setRange] = useState([0, 30]);
  const [title, setTitle] = useState('');
  const videoRef = useRef();

  const { data, error, post } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    timeout: 300000,
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
    timeout: 300000,
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
      logGAEvent(
        'error',
        'creating-clip',
        slug,
      )

      setShowError(true);
    }
  }, [data, error]);

  useEffect(() => {
    if (trimData?.video) {
      setShareModalDataAction({ data: trimData.video, mediaId: trimData.video._id });
      onClose();
    }

    if (trimError) {
      console.error('Error while trimming video', trimError);
      logGAEvent(
        'error',
        'trimming-clip',
        slug,
      )
      setShowError(true);
    }
  }, [trimData, trimError, setShareModalDataAction, slug, onClose]);

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

      logGAEvent(
        'ugc',
        'created-clip',
        slug,
      );
    }
  };

  return (
    <Layer position="center" onClickOutside={onClose}>
      <Box width="960px" height={{ min: '530px' }}>
        <Header onClose={onClose} className={style.header}>
          Zoolife Moments
        </Header>

        {isEmpty(videoData) && (
          <LoadingContent />
        )}

        {!isEmpty(videoData) && isEmpty(trimData) && (
          <Box className={style.contentContainer}>
            <Box className={style.leftSection}>
              <div className={style.videoWrapper}>

                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video ref={videoRef} src={`${videoData.videoURL}#t=0.1`} controls />
              </div>
              <div className={style.rangeInput}>
                <RangeInput onChange={rangeChangeHandler} initRange={range} />
              </div>
            </Box>
            <Box className={style.rightSection}>
              <Text size="xlarge">
                Capture clips of your favorite animals to share with friends
                and the Zoolife community.
              </Text>
              <div className={style.inputWrapper}>
                <TextInput
                  placeholder="Write a short description"
                  value={title}
                  onChange={({ target: { value }}) => setTitle(value)}
                  className={classnames(style.input, { [style.required]: !title.length })}
                  disabled={trimLoading}
                />
                <div className={style.required}>
                  <span>
                    {!title.length ? 'Please add a description to publish' : ''}
                  </span>
                </div>
              </div>
              <div className={style.buttonsWrapper}>
                <OutlineButton
                  label="Cancel"
                  size="medium"
                  onClick={onClose}
                  disabled={trimLoading}
                  className={style.submit}
                />
                <PrimaryButton
                  label="Publish"
                  size="medium"
                  loading={trimLoading}
                  onClick={trimVideoHandler}
                  disabled={!title}
                  className={style.submit}
                />
              </div>
            </Box>
          </Box>
        )}
      </Box>
      {showError && <ErrorModal onClose={() => setShowError(false)} />}
    </Layer>
  )
};

export default connect(
  (
    {
      habitat: {
        habitatInfo: {
          streamKey,
          _id,
          slug: habitatSlug,
          zoo: {
            slug: zooSlug,
          },
        },
      },
    },
  ) => ({ streamId: streamKey, habitatId: _id, slug: `${zooSlug}/${habitatSlug}` }),
  {
    setShareModalDataAction: setShareModalData,
  },
)(TrimVideoModal);
