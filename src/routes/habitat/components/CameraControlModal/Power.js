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

const Power = ({ cameraId }) => {
  const [streamStatus, setStreamStatus] = useState();

  const {
    put: putStreamStatus,
    loading: streamStatusLoading,
    response: streamStatusResponse,
    error: streamStatusError,
  } = useFetch(
    buildURL(`/admin/cameras/${cameraId}/stream`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const { loading, error, data } = useFetch(
    buildURL(`/admin/cameras/${cameraId}?${camFieldsParams}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [cameraId],
  );

  useEffect(() => {
    if (data) {
      setStreamStatus(data.cameraStatus === 'on');
    }
  }, [data]);

  const onStreamToggle = async () => {
    await putStreamStatus(streamStatus ? 'off' : 'on');
    // TODO: we either need to (1.) broadcast WS events to update these values
    // or (2.) update them in redux
    // guessing solution 1. will be used, but again leaving this here to remind us
    if (streamStatusResponse.ok) {
      setStreamStatus(!streamStatus);
    }
  };

  if (loading) {
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
    <Box pad={{ bottom: 'medium', horizontal: 'large' }} width="350px" height="210px">
      <Heading level="4">On/Off Controls</Heading>

      <Box pad="small">
        <CheckBox
          toggle
          disabled={streamStatusLoading}
          label={`Stream ${streamStatus ? 'On' : 'Off'}`}
          checked={streamStatus}
          onChange={onStreamToggle}
        />
      </Box>

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
        camera: { _id: cameraId },
      },
    },
  }) => ({ cameraId }),
)(Power);
