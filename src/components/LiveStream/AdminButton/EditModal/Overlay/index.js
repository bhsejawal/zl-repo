import { h } from 'preact';
import { connect } from 'react-redux';
import { useRef, useState } from 'preact/hooks';
import { Box, Heading, Text } from 'grommet';
import useFetch from 'use-http';

import ImageSelector from 'Components/ImageSelector';
import { SecondaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';
import { setHabitatProps } from '../../../../../routes/habitat/actions';

import samplePhoto from './overlay-sample-photo.png';

import style from './style.scss';

const imageConstraints = {
  maxResolution: 150,
  minResolution: 50,
  maxFileSize: 50_000,
  acceptedFormats: ['jpg', 'jpeg', 'png', 'svg'],
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
        <Box width="600px" pad="medium">
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
          flex="grow"
          align="center"
          pad="medium"
          overflow="hidden"
        >
          <Heading level="4">Preview Changes</Heading>

          <Box className={style.photoWrapper} margin={{ bottom: 'xlarge' }} alignSelf="stretch">
            <img src={samplePhoto} alt="sample" />
            <img
              className={style.overlayPreview}
              src={overlayStorageKey}
              ref={imageSelectorRef}
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

            <SecondaryButton
              loading={loading}
              size="large"
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
