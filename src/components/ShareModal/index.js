import { connect } from 'react-redux';

import ShareModal from './Modal';
import { closeShareModal, setShareModalMediaId } from './actions';

export default connect(
  ({
    user: { userId },
    habitat: {
      habitatInfo: {
        animal,
        zoo: { name: zoo } = {},
        camera: { _id: cameraId } = {},
      },
      shareModal: {
        open,
        nextId,
        prevId,
        data,
      },
    },
  }) => ({
    userId,
    animal,
    zoo,
    nextId,
    prevId,
    open,
    data,
    cameraId,
  }),
  { onClose: closeShareModal, setShareModalMediaId },
)(ShareModal);
