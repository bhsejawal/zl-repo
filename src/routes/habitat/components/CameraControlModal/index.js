import { connect } from 'react-redux';
import { Layer, Box } from 'grommet';

import Header from 'Components/modals/Header';
import { showSwitchCameraModal } from './actions';
import { POWER, SWITCH } from './types';
import Power from './Power';
import SwitchStream from './SwitchStream';

import style from './style.scss';

const CameraControlModal = ({ show, type, showSwitchCameraModalAction }) => {
  if (!show) {
    return null;
  }

  const onClose = () => showSwitchCameraModalAction(false);

  return (
    <Layer position="center" onClickOutside={onClose} onEsc={onClose} className={style.cameraControlModal}>
      <Box height={{ max: 'calc((100 * var(--vh)) - 30px)'}}>
        <Header onClose={onClose}>
          {type === POWER && 'Power'}
          {type === SWITCH && 'Switch Stream'}
        </Header>

        <Box height="100%">
          {type === POWER && <Power />}
          {type === SWITCH && <SwitchStream />}
        </Box>
      </Box>
    </Layer>
  );
};

export default connect(({
  habitat: {
    CameraControlModal: { show, type },
  },
}) => ({ show, type }), {
  showSwitchCameraModalAction: showSwitchCameraModal,
})(CameraControlModal);
