import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import FallbackLoader from '../../../../../../components/FallbackLoader';

const EditModal = lazy(() => import('./EditModal'));

const CardEditorLoader = ({ open, card, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <Suspense fallback={<FallbackLoader />}>
      <EditModal
        card={card}
        onClose={onClose}
      />
    </Suspense>
  );
};

export default CardEditorLoader;
