import { connect } from 'react-redux';
import { RadioButtonGroup, Box, Drop } from 'grommet';
import {
  useState,
  useRef,
  useMemo,
} from 'preact/hooks';

import RoundButton from 'Components/RoundButton';
import switchCamera from './switchCamera.svg';

import { setSelectedCamera } from '../../routes/habitat/actions';
import { useIsHabitatTabbed } from '../../hooks';

import style from './style.scss';

const CameraSelector = ({ selectedCamera, cameras, setSelectedCameraAction }) => {
  const [showSelect, setShowSelect] = useState(false);
  const selectorRef = useRef(null);
  const isHabitaTabbed = useIsHabitatTabbed();

  const availableCameras = useMemo(() => cameras.map(
    ({_id, cameraName }) => ({ label: cameraName, value: _id }),
  ), [cameras]);

  const onChangeHandler = ({ target }) => {
    const cameraId = target.value;
    const camera = cameras.find(({ _id }) => _id === cameraId);
    setSelectedCameraAction(camera);
    setShowSelect(false);
  }

  const currentCamera = useMemo(() => {
    if (cameras.length < 2) {
      return null;
    }
    const currentCamera = cameras.find(({ _id }) => _id === selectedCamera._id);
    return currentCamera?._id || cameras[0]._id;
  }, [selectedCamera, cameras])

  const clickHandler = () => setShowSelect((current) => !current);

  if (cameras.length < 2 || isHabitaTabbed) {
    return null;
  }

  return (
    <Box>
      <Box
        ref={selectorRef}
        onClick={clickHandler}
      >
        <RoundButton
          width="28"
          backgroundColor="var(--hunterGreenMediumDark)"
          color="white"
          className={style.cameraButton}
        >
          <img src={switchCamera} alt="camera selector" className={style.switchCameraIcon} />
        </RoundButton>
      </Box>
      {selectorRef.current && showSelect && (
        <Drop
          id="lalau"
          align={{ bottom: 'top' }}
          target={selectorRef.current}
          onMouseLeave={() => setShowSelect(false)}
          round="15px"
          background="#2E2D2D"
          margin={{ bottom: '10px' }}
          style={{ boxShadow: 'none' }}
        >
          <Box
            align="center"
            pad="15px"
            className={style.cameraDrop}
          >
            <RadioButtonGroup
              name="selectedStream"
              options={availableCameras}
              value={currentCamera}
              onChange={onChangeHandler}
              className={style.radioContainer}
            />
          </Box>
        </Drop>
      )}
    </Box>
  )
}

export default connect(
  ({ habitat: { habitatInfo: { selectedCamera, cameras }}}) => ({ selectedCamera, cameras }),
  { setSelectedCameraAction: setSelectedCamera },
)(CameraSelector);
