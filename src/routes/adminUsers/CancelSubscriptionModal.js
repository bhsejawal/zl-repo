import { h } from 'preact';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import { format, parseISO } from 'date-fns';

import BaseModal from './BaseModal';

const ResetPasswordModal = ({ userId, date, onClose }) => {
  const { put, response } = useFetch(
    buildURL(`/admin/users/${userId}/cancelSubscription`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onConfirm = async () => {
    await put();

    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }
  }

  return (
    <BaseModal
      heading="Cancel Subscription?"
      text={`By cancelling this user subscription, he will no longer be charged after the end of the current period, but will be able to enjoy Zoolife until ${format(parseISO(date), 'MMMM do, y - hh:mm aaa')}`}
      buttonText="Cancel"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
};

export default ResetPasswordModal;
