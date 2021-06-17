import { h } from 'preact';
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

const vivConfigKey = 'ffmpeg.video.videoInVideo.mode';
const camFieldsParams = new URLSearchParams();
camFieldsParams.append('fields[]', 'cameraStatus');
camFieldsParams.append('fields[]', 'configs');

const Power = ({ cameraId }) => {
  const [streamStatus, setStreamStatus] = useState();
  const [hostVideoStatus, setHostVideoStatus] = useState();

  const {
    put: putStreamStatus,
    loading: streamStatusLoading,
    response: streamStatusResponse,
    error: streamStatusError,
  } = useFetch(
    buildURL(`/admin/cameras/${cameraId}/stream`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const {
    put: putHostVideoStatus,
    loading: hostVideoStatusLoading,
    response: hostVideoStatusResponse,
    error: hostVideoStatusError,
  } = useFetch(
    buildURL(`/admin/cameras/${cameraId}/configs/${vivConfigKey}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const { loading, error, data } = useFetch(
    buildURL(`/admin/cameras/${cameraId}?${camFieldsParams}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [cameraId],
  );

  useEffect(() => {
    if (data) {
      const { configValue: vivValue } = data.configs
        .find(({ configKey }) => configKey === vivConfigKey);
      setStreamStatus(data.cameraStatus === 'on');
      setHostVideoStatus(vivValue === 'on');
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

  const onHostVideoToggle = async () => {
    await putHostVideoStatus({ value: hostVideoStatus ? 'off' : 'on' });
    // TODO: we either need to (1.) broadcast WS events to update these values
    // or (2.) update them in redux
    // guessing solution 1. will be used, but again leaving this here to remind us
    if (hostVideoStatusResponse.ok) {
      setHostVideoStatus(!hostVideoStatus);
    }
  };

  if (loading) {
    return (
      <Loader fill />
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
    <Box pad={{ vertical: 'medium', horizontal: 'large' }} width="350px">
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

      <Box pad="small">
        <CheckBox
          toggle
          disabled={hostVideoStatusLoading}
          label={`Host Video ${hostVideoStatus ? 'On' : 'Off'}`}
          checked={hostVideoStatus}
          onChange={onHostVideoToggle}
        />
      </Box>

      {(streamStatusError || hostVideoStatusError) && (
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
