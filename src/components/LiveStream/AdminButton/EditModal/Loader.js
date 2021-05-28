import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import LoaderModal from 'Components/LoaderModal';

const EditModal = lazy(() => import('.'));

const StreamEditModalLoader = ({ openSection, onClose }) => {
  if (!openSection) {
    return null;
  }

  return (
    <Suspense fallback={<LoaderModal />}>
      <EditModal section={openSection} onClose={onClose} />
    </Suspense>
  );
};

export default StreamEditModalLoader;
