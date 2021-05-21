import { h } from 'preact';
import { connect } from 'react-redux';
import { useRef, useState } from 'preact/hooks';
import { Box, Heading, Text } from 'grommet';
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
  maxFileSize: 60_000,
  aspectRatio: '16:9',
  acceptedFormats: ['png'],
};

const Overlay = ({
  habitatId,
  overlayStorageKey: overlayStorageKeyProp = '',
  setHabitatPropsAction,
}) => {
  const imageSelectorRef = useRef();
  const imagePreviewRef = useRef();
  const [overlayStorageKey, setOverlayStorageKey] = useState(overlayStorageKeyProp);
  const [validationError, setValidationError] = useState();

  const {
    patch: patchOverlay,
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
      await patchOverlay({ overlayStorageKey });
      if (patchResponse.ok) {
        setHabitatPropsAction({ overlayStorageKey });
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
      },
    },
  }) => ({
    habitatId,
    overlayStorageKey,
  }),
  { setHabitatPropsAction: setHabitatProps },
)(Overlay);
