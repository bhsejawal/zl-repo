import { h } from 'preact';
import { connect } from 'react-redux';
import { useRef, useState } from 'preact/hooks';
import { Box, Text } from 'grommet';
import useFetch from 'use-http';
import { isArray } from 'lodash-es';

import { PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';
import Trailer from 'Components/LiveStream/AdminButton/EditModal/Configuration/Trailer';
import HabitatTags from 'Components/LiveStream/AdminButton/EditModal/Configuration/HabitatTags';

import { setHabitatProps } from '../../../../../routes/habitat/actions';

import style from './style.scss';

const Configuration = ({
  habitatId,
  trailer,
  shareSettings,
  setHabitatPropsAction,
}) => {
  const [videoURL, setVideoURL] = useState(trailer?.videoURL);
  const [hashtags, setHashtags] = useState(
    isArray(shareSettings.hashtag) ? shareSettings.hashtag : [],
  );
  const [validationError, setValidationError] = useState();
  const videoSelectorRef = useRef();

  const {
    post,
    patch,
    loading,
    error: patchError,
  } = useFetch(
    buildURL(`admin/habitats/${habitatId}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const updateVideoURL = async () => {
    const isValid = await videoSelectorRef.current.validate();

    if (isValid) {
      setValidationError(false);
      await post('/trailer', { videoURL });
      setHabitatPropsAction({ trailer: { ...trailer, videoURL } });
    } else {
      setValidationError('Your input is not valid.');
    }
  }

  const updateHashtags = async () => {
    setValidationError(false);
    await patch('/prop', { shareSettings: {...shareSettings, hashtag: hashtags} });
    setHabitatPropsAction({ shareSettings: { ...shareSettings, hashtag: hashtags } });
  }

  const onPublish = async () => {
    if (trailer.videoURL !== videoURL) {
      await updateVideoURL();
    }
    if (shareSettings.hashtag !== hashtags) {
      await updateHashtags();
    }
  }

  return (
    <Box justify="center" align="center" flex="grow">
      <Box fill align="stretch" direction="row">
        <Box width="500px" pad="medium">
          <Box margin={{ top: 'medium' }} pad={{ horizontal: 'medium' }} className="customScrollBar grey">

            <Trailer ref={videoSelectorRef} videoURL={videoURL} setVideoURL={setVideoURL} />
            <HabitatTags habitatTags={hashtags} setHabitatTags={setHashtags} />

            <Box>
              {(patchError || validationError) && (
                <Box pad={{ vertical: 'medium' }}>
                  <Text size="14px" textAlign="center" color="status-error" margin={{ top: '10px'}}>
                    {!patchError && (validationError || 'Please check your input and try again')}
                    {patchError && 'Please try again'}
                  </Text>
                </Box>
              )}
              <PrimaryButton
                label="Publish"
                loading={loading}
                onClick={onPublish}
                className={style.publish}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id,
        trailer,
        shareSettings,
      },
    },
  }) => ({
    habitatId: _id,
    trailer,
    shareSettings,
  }),
  {
    setHabitatPropsAction: setHabitatProps,
  },
)(Configuration);
