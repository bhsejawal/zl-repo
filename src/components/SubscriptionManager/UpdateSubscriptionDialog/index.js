import { connect } from 'react-redux';
import { format } from "date-fns";
import { useMemo } from 'preact/hooks';
import useFetch from 'use-http';

import Dialog from 'Components/modals/Dialog';
import Loader from 'Components/async/LoaderModal';

import { buildURL } from 'Shared/fetch';
import { setSubscriptionData } from '../../../redux/actions';

const defaultText = 'You will be charged for the $NEW_PLAN pass on $VALID_UNTIL after your current pass expires.';
const defaultTitle = 'Payment Notice';

const UpdateSubscriptionDialog = ({
  action,
  planId,
  priceId,
  show,
  interval,
  validUntil,
  onCancelHandler,
  setSubscriptionDataAction,
}) => {
  const { post, response, loading } = useFetch(
    buildURL(),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const renewSubscription = () => post(`/users/subscription/renew`);

  const updateSubscription = () => post(`/users/subscription/${planId}/${priceId}`);

  const onConfirmHandler = async () => {
    try {
      let data;
      if (action.toLowerCase() === 'renew') {
        data = await renewSubscription();
      } else {
        data = await updateSubscription();
      }

      if (response.ok) {
        const { subscriptionStatus } = data;
        setSubscriptionDataAction(subscriptionStatus);
        onCancelHandler();
      }
    } catch (err) {
      console.error(`Error trying to perform subscription ${action}`, err.message);
    }
  }

  const validUntilReadable = validUntil ? format(validUntil, 'MMMM dd, yyyy') : null;

  const dialogText = useMemo(() => defaultText
    .replace('$VALID_UNTIL', validUntilReadable)
    .replace('$CURRENT_PLAN', 'annual')
    .replace('$NEW_PLAN', interval === 'month' ? 'monthly' : 'annual'), [validUntilReadable, interval])

  if (!show) {
    return null;
  }

  if (loading) {
    return (<Loader />)
  }

  return (
    <Dialog
      text={dialogText}
      title={defaultTitle}
      buttonLabel={action}
      onConfirm={onConfirmHandler}
      onCancel={onCancelHandler}
    />
  )
};

export default connect((
  { user: { subscription: { validUntil} } },
) => ({ validUntil }
), { setSubscriptionDataAction: setSubscriptionData })(UpdateSubscriptionDialog);
