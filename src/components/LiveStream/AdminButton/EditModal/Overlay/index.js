import { h } from 'preact';
import { connect } from 'react-redux';
import { useRef, useState } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import useFetch from 'use-http';

import ImageSelector from 'Components/ImageSelector';
import { PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';
import { setHabitatProps } from '../../../../../routes/habitat/actions';

import samplePhoto from './overlay-sample-photo.jpeg';

import style from './style.scss';

const imageConstraints = {
  width: 1920,
  height: 1080,
  maxFileSize: 300_000,
  aspectRatio: '16:9',
  acceptedFormats: ['png'],
};

const Overlay = ({
  habitatId,
  shareTitle,
  shareDescription,
  restShareSettings,
  overlayStorageKey: overlayStorageKeyProp = '',
  setHabitatPropsAction,
}) => {
  const imageSelectorRef = useRef();
  const imagePreviewRef = useRef();
  const [overlayStorageKey, setOverlayStorageKey] = useState(overlayStorageKeyProp);
  const [title, setTitle] = useState(shareTitle);
  const [description, setDescription] = useState(shareDescription);
  const [validationError, setValidationError] = useState();

  const {
    patch,
    response: patchResponse,
    loading,
    error,
  } = useFetch(
    buildURL(`admin/habitats/${habitatId}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onPublish = async () => {
    const isValid = await imageSelectorRef.current.validate();

    if (isValid) {
      setValidationError(false);
      await patch({
        overlayStorageKey,
        shareSettings: { title, description },
      });
      if (patchResponse.ok) {
        setHabitatPropsAction({
          overlayStorageKey,
          shareSettings: { title, description },
          ...restShareSettings,
        });
      }
    } else {
      setValidationError('Your input is not valid.');
    }
  }

  return (
    <Box justify="center" align="center" flex="grow">
      <Box fill align="stretch" direction="row">
        <Box width={{ min: '500px' }} pad="medium">
          <Box margin={{ top: 'medium' }} pad={{ horizontal: 'medium' }} className="customScrollBar grey">
            <Heading level="4" margin={{ top: '0' }}>Update Overlay</Heading>

            <ImageSelector
              label="Overlay:"
              ref={imageSelectorRef}
              previewRef={imagePreviewRef}
              url={overlayStorageKey}
              required
              constraints={imageConstraints}
              onChange={setOverlayStorageKey}
            />

            <Box margin={{ bottom: '20px', top: '20px' }}>
              <Heading margin={{ top: '0', bottom: '5px' }} level="5">
                Title:
              </Heading>
              <TextInput
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </Box>

            <Box margin={{ bottom: '20px' }}>
              <Heading margin={{ top: '0', bottom: '5px' }} level="5">
                Description:
              </Heading>
              <TextArea
                value={description}
                className={style.textarea}
                rows="5"
                data-prop="text"
                onChange={(({ target }) => setDescription(target.value))}
                maxLength="80"
              />
            </Box>
          </Box>

        </Box>

        <Box
          border={{ side: 'left', color: 'var(--lightGrey)' }}
          flex="shrink"
          align="center"
          pad="medium"
          overflow="hidden"
        >
          <Heading level="4">Preview Changes</Heading>

          <Box className={style.photoWrapper} margin={{ bottom: 'xlarge' }} alignSelf="stretch">
            <img src={samplePhoto} className={style.placeholderImg} alt="sample" />
            <img
              className={style.overlayPreview}
              src={overlayStorageKey}
              ref={imagePreviewRef}
              alt="overlay"
            />
          </Box>

          <Box>
            {/* TODO: maybe we should add a success message here */}
            {(error || validationError) && (
              <Box pad={{ vertical: 'medium' }}>
                <Text size="14px" textAlign="center" color="status-error" margin={{ top: '10px'}}>
                  {validationError || 'There was an error.'}
                  <br />
                  Please check your input and try again.
                </Text>
              </Box>
            )}
            <PrimaryButton
              loading={loading}
              label="Publish"
              onClick={onPublish}
            />
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
        _id: habitatId,
        overlayStorageKey,
        shareSettings: {
          title: shareTitle,
          description: shareDescription,
          ...restShareSettings
        } = {},
      },
    },
  }) => ({
    habitatId,
    overlayStorageKey,
    shareTitle,
    shareDescription,
    restShareSettings,
  }),
  { setHabitatPropsAction: setHabitatProps },
)(Overlay);
