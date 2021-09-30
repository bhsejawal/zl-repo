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
import CloseButton from 'Components/modals/CloseButton';
import ErrorModal from 'Components/modals/Error';
import { setShareModalData } from 'Components/ShareModal/actions';

import { useIsMobileSize } from '../../../../../../hooks';

import style from './style.scss';

const TakeSnapshotModal = ({
  snapshotId,
  image,
  onClose,
  slug,
  setShareModalDataAction,
}) => {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const isMobileSize = useIsMobileSize();

  const {
    response,
    error,
    put,
    del,
    loading,
    data,
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
    }
  }, [error, response.ok]);

  useEffect(() => {
    if (data?.photo) {
      setShareModalDataAction({ data: data.photo, mediaId: data.photo._id });
      onClose();
    }
  }, [data, setShareModalDataAction, onClose]);

  const onCloseHandler = async () => {
    await del(`/photos/${snapshotId}`, { force: true });
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
        <CloseButton onClick={onCloseHandler} className={style.close} />

        <Box className={style.contentContainer}>
          <Box className={style.contentWrapper}>
            <Box className={style.leftSection}>
              <img src={image} alt="" />
            </Box>
            <Box className={style.rightSection}>
              <Text size="xlarge">
                Capture moments of your favorite animals to share with friends
                and the Zoolife community.
              </Text>
              <div className={style.inputWrapper}>
                <TextInput
                  placeholder="Write a short description"
                  value={title}
                  onChange={({ target: { value }}) => setTitle(value)}
                  className={style.input}
                  disabled={loading}
                />
              </div>
              <div className={style.buttonsWrapper}>
                <PrimaryButton
                  label="Save & Share"
                  size="large"
                  loading={loading}
                  onClick={clickHandler}
                  disabled={!title}
                  className={style.submit}
                />
              </div>
            </Box>
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
}), {
  setShareModalDataAction: setShareModalData,
})(TakeSnapshotModal);
