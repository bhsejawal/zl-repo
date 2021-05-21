import { h } from 'preact';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';

import BaseModal from './BaseModal';

const ResetPasswordModal = ({ email, onClose }) => {
  const { post, response } = useFetch(
    buildURL('/users/password/reset'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onConfirm = async () => {
    const { origin } = window.location;

    await post({ email, origin });

    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }
  }

  return (
    <BaseModal
      heading="Reset Password"
      text={`Reset Password for ${email}`}
      buttonText="Send Reset Email"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
};

export default ResetPasswordModal;
