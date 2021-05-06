import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { faShare } from '@fortawesome/pro-solid-svg-icons';

import LoaderModal from 'Components/async/LoaderModal';
import NavItem from '../NavItem';

const InviteModal = lazy(() => import('./Modal'));

const InviteComponent = ({
  isOpen,
  open,
  close,
  text = "Invite",
}) => {
  const onClick = useCallback((evt) => {
    evt.preventDefault();
    open();
  }, [open]);

  const onClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <>
      <NavItem text={text} icon={faShare} onClick={onClick} />

      {isOpen && (
        <Suspense fallback={<LoaderModal />}>
          <InviteModal onClose={onClose} />
        </Suspense>
      )}
    </>
  );
};

export default InviteComponent;
