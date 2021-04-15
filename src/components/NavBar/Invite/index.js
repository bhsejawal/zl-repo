import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { faShare } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';

import LoaderModal from 'Components/async/LoaderModal';
import NavItem from '../NavItem';
import { closeInviteModal, openInviteModal } from './actions';

const InviteModal = lazy(() => import('./Modal'));

const Invite = ({
  isOpen,
  openInviteModalAction,
  closeInviteModalAction,
  text = "Invite",
}) => {
  const onClick = useCallback((evt) => {
    evt.preventDefault();
    openInviteModalAction();
  }, [openInviteModalAction]);

  const onClose = useCallback(() => {
    closeInviteModalAction();
  }, [closeInviteModalAction]);

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

export default connect(
  ({ modals: { invite: { isOpen } } }) => ({ isOpen }),
  {
    openInviteModalAction: openInviteModal,
    closeInviteModalAction: closeInviteModal,
  },
)(Invite);
