import { h } from 'preact';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';

import BaseModal from './BaseModal';

const DisableModal = ({ selected, onClose, updateTable }) => {
  const { del, response } = useFetch(buildURL('/admin/users'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const onConfirm = async () => {
    await del(selected._id);

    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    updateTable();
  };

  return (
    <BaseModal
      heading="Disable User"
      text="Disabling a user will make it inaccessible by the public."
      buttonText="Disable"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
};

export default DisableModal;
