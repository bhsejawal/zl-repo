import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import {
  Box,
  Heading,
  RadioButtonGroup,
  Text,
} from 'grommet';
import useFetch from 'use-http';

import { PrimaryButton } from 'Components/Buttons';
import { API_BASE_URL } from 'Shared/fetch';
import Loader from 'Components/Loader';

import style from './style.scss';

const SwitchStream = ({ habitatId, cameraId }) => {
  const [habitatCameras, setHabitatCameras] = useState();
  const [selectedCamera, setSelectedCamera] = useState(cameraId);
  const {
    data: cameras,
    get: getCameras,
    loading: loadingCameras,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });
  const {
    put: switchCamera,
    loading: switchCameraLoading,
    error: switchCameraError,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

  useEffect(() => {
    if (!cameras) {
      const params = new URLSearchParams();
      params.append('fields[]', 'cameraName');
      params.append('fields[]', 'habitat');
      getCameras(`/admin/cameras?${params}`);
    }

    if (cameras) {
      setHabitatCameras(cameras
        .filter(({ habitat }) => habitat === habitatId)
        .map(({ cameraName: label, _id: value }) => ({ label, value })));
    }
  }, [cameras, getCameras, habitatId]);

  const onSwitch = () => {
    switchCamera(`/admin/habitats/${habitatId}/${selectedCamera}`);
  };

  return (
    <Box justify="center" align="center" flex="grow">
      <Box fill align="stretch" direction="row">
        <Box width="500px" pad="medium">
          <Box pad={{ horizontal: 'medium' }} height={{ min: '240px' }}>

            {loadingCameras && (<Box height="150px" margin="auto"><Loader fill /></Box>)}
            {habitatCameras && (
              <Box flex="grow">
                <Box>
                  <Heading margin={{ vertical: '0' }} level="5">Select which stream to broadcast:</Heading>
                </Box>

                <Box height={{ min: '80px' }} margin={{ top: '16px', bottom: '40px' }}>
                  <RadioButtonGroup
                    name="camera"
                    options={habitatCameras}
                    value={selectedCamera}
                    onChange={(event) => setSelectedCamera(event.target.value)}
                    disabled={switchCameraLoading}
                  />
                </Box>

                <Box>
                  <PrimaryButton
                    label={switchCameraLoading ? 'Switching...' : 'Switch'}
                    loading={switchCameraLoading}
                    onClick={onSwitch}
                    className={style.switch}
                    disabled={switchCameraLoading || cameraId === selectedCamera}
                  />
                  {switchCameraLoading && (
                    <Text size="medium" margin={{ top: '12px', horizontal: 'auto' }}>This can take a minute.</Text>
                  )}
                  {switchCameraError && (
                    <Text size="medium" margin={{ top: '12px', horizontal: 'auto' }} color="var(--red)">
                      Something Went wrong, please try again!
                    </Text>
                  )}
                </Box>
              </Box>
            )}
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
        camera: { _id: cameraId },
      },
    },
  }) => ({
    habitatId,
    cameraId,
  }),
)(SwitchStream);
