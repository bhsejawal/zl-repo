import { connect} from 'react-redux';
import { isEmpty } from 'lodash-es';
import { useEffect, useState } from 'preact/hooks';
import {
  Box,
  Layer,
  Text,
  TextInput,
} from 'grommet';
import useFetch from 'use-http';

import { logGAEvent } from 'Shared/ga';
import CloseButton from 'Components/modals/CloseButton';
import VideoPlayer from 'Components/VideoPlayer';
import RangeInput from 'Components/RangeInput';
import ErrorModal from 'Components/modals/Error';
import { getTimeString } from 'Components/RangeInput/helper';
import { PrimaryButton } from 'Components/Buttons';
import { setShareModalData } from 'Components/ShareModal/actions';
import { API_BASE_URL } from 'Shared/fetch';

import style from './style.scss';

const TrimVideoModal = ({
  videoData,
  onClose,
  streamId,
  habitatId,
  slug,
  setShareModalDataAction,
}) => {
  const [showError, setShowError] = useState(false);
  const [range, setRange] = useState([0, 30]);
  const [title, setTitle] = useState('');

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
    setRange([min, max]);
  };

  const trimVideoHandler = () => {
    if (title) {
      const [min, max] = range;

      trimPost('/videos/trim', {
        videoURL: videoData.videoURL,
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
      <CloseButton onClick={onClose} className={style.close} />
      <Box width="960px">
        {isEmpty(trimData) && (
          <Box className={style.contentContainer}>
            <Box className={style.leftSection}>
              <div className={style.videoWrapper}>
                <VideoPlayer
                  videoURL={`${videoData.videoURL}#t=0.1`}
                  autoPlay
                  muted
                  isGuest
                  key={videoData.videoURL}
                  currentTime={range[0]}
                />

                <div className={style.rangeInput}>
                  <RangeInput onChange={rangeChangeHandler} initRange={range} />
                </div>
              </div>
            </Box>
            <Box className={style.rightSection}>
              <Text size="16px" margin={{ bottom: '13px' }}>
                <b>Great clip!</b>
              </Text>
              <Text size="medium" >
                Add your observations below to help researchers learn about the species.
              </Text>
              <div className={style.inputWrapper}>
                <TextInput
                  placeholder="What’s happening in this clip? (required)"
                  value={title}
                  onChange={({ target: { value }}) => setTitle(value)}
                  className={style.input}
                  disabled={trimLoading}
                />
              </div>
              <div className={style.buttonsWrapper}>
                <PrimaryButton
                  label="Save & Share"
                  size="large"
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
