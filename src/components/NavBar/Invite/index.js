import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { faShare } from '@fortawesome/pro-solid-svg-icons';

import LoaderModal from 'Components/async/LoaderModal';
import NavItem from '../NavItem';

const InviteModal = lazy(() => import('./Modal'));

const Invite = () => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback((evt) => {
    evt.preventDefault();
    setOpen(!open);
  }, [open]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem text="Invite" icon={faShare} onClick={onClick} />

      {open && (
        <Suspense fallback={<LoaderModal />}>
          <InviteModal onClose={onClose} />
        </Suspense>
      )}
    </>
  );
};

export default Invite;
