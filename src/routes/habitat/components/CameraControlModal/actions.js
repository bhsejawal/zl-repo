import { SHOW_CAMERA_CONTROL_MODAL } from './types';

// eslint-disable-next-line import/prefer-default-export
export const showSwitchCameraModal = (show, type) => ({
  type: SHOW_CAMERA_CONTROL_MODAL,
  payload: { show, type },
});
