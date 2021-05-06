import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import InviteComponent from './InviteComponent';

const NonReduxInvite = ({ text }) => {
  const [isOpen, setIsOpen] = useState();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <InviteComponent
      text={text}
      isOpen={isOpen}
      open={open}
      close={close}
    />
  );
};

export default NonReduxInvite;
