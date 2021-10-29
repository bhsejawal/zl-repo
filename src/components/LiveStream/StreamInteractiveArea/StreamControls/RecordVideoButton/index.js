import { connect } from 'react-redux'
import { isEmpty } from 'lodash-es';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { useState, useEffect } from 'preact/hooks';
import classnames from 'classnames';
import { Button, Tip, Box } from 'grommet';
import useFetch from 'use-http';

import RoundButton from 'Components/RoundButton';
import TipContent from 'Components/Tooltip';
import { API_BASE_URL } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';
import TrimVideoModal from './TrimVideoModal';
import { setClipButtonClicked } from '../../../../../redux/actions'

import style from './style.scss';

const RecordVideoButton = ({
  isClicked,
  setClipButtonClickedAction,
  plain,
  streamId,
  slug,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [videoData, setVideoData] = useState({});
  const {
    loading,
    data,
    error,
    post,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    timeout: 300000,
  });

  useEffect(() => {
    if (showModal) post('/videos/clip', { streamId });
  }, [post, streamId, showModal]);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const onClickHandler = () => {
    setShowModal(true);
    setClipButtonClickedAction(true);
  };

  if (plain) {
    return (
      <>
        <Button
          plain
          onClick={onClickHandler}
          className={style.mobileButton}
          disabled={loading}
        >
          {loading
            ? <FontAwesomeIcon color="#fff" size="lg" icon={faSpinner} spin />
            : <FontAwesomeIcon color="#fff" size="lg" icon={faVideo} />}
        </Button>
        {showModal && !isEmpty(videoData) && (
          <TrimVideoModal onClose={() => setShowModal(false)} videoData={videoData} />
        )}
      </>
    );
  }

  return (
    <>
      <Tip
        dropProps={{ align: { left: 'right' } }}
        content={<TipContent message="Take a Clip" />}
        plain
      >
        <Box>
          <RoundButton
            onClick={onClickHandler}
            width="36"
            backgroundColor="var(--blueDark)"
            color="white"
            className={classnames(style.button, { [style.animate]: !isClicked })}
            disabled={loading}
            loading={loading}
          >
            <FontAwesomeIcon icon={faVideo} />
          </RoundButton>
        </Box>
      </Tip>
      {showModal && !isEmpty(videoData) && (
        <TrimVideoModal onClose={() => setShowModal(false)} videoData={videoData} />
      )}
    </>
  );
};

export default connect(({
  user: { clipButtonClicked: isClicked },
  habitat: {
    habitatInfo: {
      streamKey,
      slug: habitatSlug,
      zoo: {
        slug: zooSlug,
      },
    },
  },
}) => ({ isClicked, streamId: streamKey, slug: `${zooSlug}/${habitatSlug}`}), {
  setClipButtonClickedAction: setClipButtonClicked,
})(RecordVideoButton);
