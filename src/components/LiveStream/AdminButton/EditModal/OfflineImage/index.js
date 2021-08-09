import { h } from 'preact';
import { connect } from 'react-redux';
import { useRef, useState } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';

import ImageSelector from 'Components/ImageSelector';
import { PrimaryButton } from 'Components/Buttons';
import { buildURL} from 'Shared/fetch';
import { setHabitatProps } from '../../../../../routes/habitat/actions';

import style from './style.scss';

const OfflineImage = ({
  habitatId,
  offlineImage,
  setHabitatPropsAction,
}) => {
  const [data, setData] = useState({ offlineImage });
  const [validationError, setValidationError] = useState();
  const imageSelectorRef = useRef();

  const {
    patch,
    response: patchResponse,
    loading,
    error: patchError,
  } = useFetch(
    buildURL(`admin/habitats/${habitatId}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onPublish = async () => {
    const isValid = await imageSelectorRef.current.validate();

    if (isValid) {
      setValidationError(false);
      await patch(data);
      if (patchResponse.ok) {
        setHabitatPropsAction(data);
      }
    } else {
      setValidationError('Your input is not valid.');
    }
  }

  return (
    <Box justify="center" align="center" flex="grow">
      <Box fill align="stretch" direction="row">
        <Box width="500px" pad="medium">
          <Box margin={{ top: 'medium' }} pad={{ horizontal: 'medium' }} className="customScrollBar grey">

            <Box margin={{ bottom: '20px' }}>
              <Heading margin={{ top: '0', bottom: '5px' }} level="5">Offline Image</Heading>
              <ImageSelector
                url={data.offlineImage}
                ref={imageSelectorRef}
                placeholder="https://"
                constraints={{
                  width: 1280,
                  height: 720,
                  maxFileSize: 1_000_000,
                  aspectRatio: '16:9',
                  acceptedFormats: ['jpeg', 'jpg'],
                }}
                onChange={(value) => setData({ ...data, offlineImage: value })}
              />
            </Box>

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
        _id: habitatId,
        offlineImage,
      },
    },
  }) => ({
    habitatId,
    offlineImage,
  }),
  { setHabitatPropsAction: setHabitatProps },
)(OfflineImage);
