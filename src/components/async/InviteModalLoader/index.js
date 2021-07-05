import { Suspense, lazy } from 'preact/compat';

import LoaderModal from 'Components/LoaderModal';

const InviteModal = lazy(() => import('Components/NavBar/Invite/Modal'));

const InviteModalLoader = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={<LoaderModal />}>
      <InviteModal />
    </Suspense>
  );
}

export default InviteModalLoader;
