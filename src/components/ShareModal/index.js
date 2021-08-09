import { connect } from 'react-redux';

import ShareModal from './Modal';
import { closeShareModal, setShareModalMediaId } from './actions';

export default connect(
  ({
    user: { userId },
    habitat: {
      habitatInfo: {
        animal,
        slug: habitatSlug,
        zoo: { name: zoo, slug: zooSlug } = {},
        camera: { _id: cameraId } = {},
      },
      shareModal: {
        open,
        nextId,
        prevId,
        data,
        mediaId,
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
    mediaId,
    slug: `${zooSlug}/${habitatSlug}`,
  }),
  { onClose: closeShareModal, setShareModalMediaId },
)(ShareModal);
