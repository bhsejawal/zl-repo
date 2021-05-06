import { h } from 'preact';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';

import BaseModal from './BaseModal';

const EnableModal = ({ selected, onClose, updateTable }) => {
  const { patch, response } = useFetch(buildURL('/admin/users'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const onConfirm = async () => {
    await patch(selected._id, {
      disabled: false,
      disabledAt: null,
      disabledBy: null,
    });

    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    updateTable();
  };

  return (
    <BaseModal
      heading="Enable User"
      text="Enabling a user will make it accessible by the public."
      buttonText="Enable"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
};

export default EnableModal;
