import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { faShare } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';

import NavItem from '../NavItem';
import { openInviteModal } from './actions';

const Invite = ({
  openInviteModalAction,
  text = "Invite",
}) => {
  const onClick = useCallback((evt) => {
    evt.preventDefault();
    openInviteModalAction();
  }, [openInviteModalAction]);

  return (
    <>
      <NavItem text={text} icon={faShare} onClick={onClick} />
    </>
  );
};

export default connect(
  ({ modals: { invite: { isOpen } } }) => ({ isOpen }),
  {
    openInviteModalAction: openInviteModal,
  },
)(Invite);
