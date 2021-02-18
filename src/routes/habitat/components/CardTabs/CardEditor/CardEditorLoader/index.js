import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import Loader from 'Components/async/Loader';

const EditModal = lazy(() => import('./EditModal'));

const CardEditorLoader = ({ open, card, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <EditModal
        card={card}
        onClose={onClose}
      />
    </Suspense>
  );
};

export default CardEditorLoader;
