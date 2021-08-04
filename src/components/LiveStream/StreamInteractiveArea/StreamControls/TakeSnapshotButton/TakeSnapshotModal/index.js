import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Box,
  Layer,
  Text,
  TextInput,
} from 'grommet';
import useFetch from 'use-http';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { PrimaryButton } from 'Components/Buttons';
import { API_BASE_URL } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';
import Header from 'Components/modals/Header';
import ErrorModal from 'Components/modals/Error';
import ShareSection from './ShareSection';
import { useIsMobileSize } from '../../../../../../hooks';

import style from './style.scss';

const TakeSnapshotModal = ({
  snapshotId,
  image,
  htmlURL,
  onClose,
  slug,
}) => {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [showShareSection, setShowShareSection] = useState(false);
  const isMobileSize = useIsMobileSize();

  const {
    response,
    error,
    put,
    del,
    loading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (error) {
      setShowError(true);
    }

    if (response.ok) {
      setShowError(false);
      setShowShareSection(true);
    }
  }, [error, response.ok]);

  const onCloseHandler = async () => {
    if (!showShareSection) {
      await del(`/photos/${snapshotId}`, { force: true });
    }
    onClose();
  };

  const clickHandler = () => {
    put(`/photos/${snapshotId}`, { title, share: true });
    logGAEvent(
      'ugc',
      'created-photo',
      slug,
    );
  };

  return (
    <Layer position="center" onClickOutside={onCloseHandler}>
      <Box width="960px" height={{ min: '480px' }} className={classnames({ [style.mobile]: isMobileSize })}>
        <Header onClose={onCloseHandler} className={style.header}>
          Zoolife Moments
        </Header>

        <Box className={style.contentContainer}>
          <Box className={style.contentWrapper}>
            <Box className={style.leftSection}>
              <img src={image} alt="" />
            </Box>

            {!showShareSection && (
              <Box className={style.rightSection}>
                <Text size="xlarge">
                  Capture moments of your favorite animals to share with friends
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
                  loading={loading}
                  onClick={clickHandler}
                  disabled={!title}
                  className={style.submit}
                />
              </Box>
            )}

            {showShareSection && (
              <ShareSection
                imageURL={image}
                htmlURL={htmlURL}
                title={title}
                mediaId={snapshotId}
              />
            )}
          </Box>
        </Box>
      </Box>
      {showError && <ErrorModal onClose={() => setShowError(false)} />}
    </Layer>
  );
};

export default connect(({
  habitat: {
    habitatInfo: {
      slug: habitatSlug,
      zoo: {
        slug: zooSlug,
      },
    },
  },
}) => ({
  slug: `${zooSlug}/${habitatSlug}`,
}))(TakeSnapshotModal);
