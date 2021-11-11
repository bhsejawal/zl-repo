import { useEffect, useState } from 'preact/hooks';
import {
  Box,
  CheckBox,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import { connect } from 'react-redux';
import Loader from 'Components/Loader';

const camFieldsParams = new URLSearchParams();
camFieldsParams.append('fields[]', 'cameraStatus');
camFieldsParams.append('fields[]', 'configs');

const Power = ({ habitatId }) => {
  const [cameras, setCameras] = useState([]);

  const {
    put: putStreamStatus,
    loading: streamStatusLoading,
    response: streamStatusResponse,
    error: streamStatusError,
  } = useFetch(
    buildURL(`/admin/cameras`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const { loading, error, data } = useFetch(
    buildURL(`/admin/habitats/${habitatId}/cameras`),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [habitatId],
  );

  useEffect(() => {
    if (data) {
      setCameras(data);
    }
  }, [data]);

  const onStreamToggle = async (cameraId, streamStatus) => {
    const newStatus = streamStatus === 'on' ? 'off' : 'on';
    await putStreamStatus(`${cameraId}/stream/${newStatus}`);

    if (streamStatusResponse.ok) {
      setCameras((currentCameras) => currentCameras.map((camera) => ({
        ...camera,
        cameraStatus: camera._id === cameraId ? newStatus : camera.cameraStatus,
      })));
    }
  }

  if (loading || streamStatusLoading) {
    return (
      <Box pad={{ bottom: 'medium', horizontal: 'large' }} width="350px" height="210px" align="center">
        <Box width="150px" height="150px" margin={{ top: '24px' }}>
          <Loader fill />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box alignContent="center" justify="center">
        <Text color="status-error">
          There was an error. Please try again or contact administrator.
        </Text>
      </Box>
    );
  }

  return (
    <Box pad={{ bottom: 'medium', horizontal: 'large' }} width="350px">
      <Heading level="4">On/Off Controls</Heading>
      {cameras.map((camera) => (
        <Box pad="small">
          <CheckBox
            toggle
            disabled={streamStatusLoading}
            label={`Stream ${camera.cameraName}`}
            checked={camera.cameraStatus === 'on'}
            onChange={() => onStreamToggle(camera._id, camera.cameraStatus)}
          />
        </Box>
      ))}
      {streamStatusError && (
        <Box pad="large">
          <Text color="status-error">
            There was an error. Please try again or contact administrator.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
      },
    },
  }) => ({ habitatId }),
)(Power);
