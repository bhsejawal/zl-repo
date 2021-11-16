import useFetch from 'use-http';
import { connect } from 'react-redux';
import { Heading, Layer, Text } from 'grommet';

import CloseButton from 'Components/modals/CloseButton';
import { OutlineButton, PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';

import { setSubscriptionData } from '../../../redux/actions';

import style from './style.scss';

const CancelSubscriptionModal = ({
  onClose,
  validUntil,
  setSubscriptionDataAction,
}) => {
  const { post, loading, error } = useFetch(
    buildURL(),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const cancelSubscription = async () => {
    const { subscriptionStatus } = await post('/users/subscription/unsubscribe');

    if (!error) {
      setSubscriptionDataAction(subscriptionStatus);
      onClose();
    }
  }

  return (
    <Layer position="center" onClickOutside={onClose} onEsc={onClose} background="white">
      <div className={style.cancelSubscriptionContainer}>
        <div>
          <CloseButton varient="grey" onClick={onClose} className={style.close} />
          <Heading level="4" color="var(--charcoal)">
            Are you sure you want to cancel?
          </Heading>
        </div>
        <Text textAlign="center" size="xlarge" className={style.text}>
          By cancelling, you will no longer have access to all habitats past&nbsp;
          {new Date(validUntil).toLocaleDateString()}
        </Text>
        <div className={style.buttonsContainer}>
          <OutlineButton
            label="Yes"
            loading={loading}
            onClick={cancelSubscription}
          />
          <PrimaryButton
            label="No"
            disabled={loading}
            onClick={onClose}
          />
        </div>
        {error && (
          <Text textAlign="center" size="xlarge" color="var(--red)">
            Something went wrong. Please try again.
          </Text>
        )}
      </div>
    </Layer>
  )
};

export default connect((
  { user: { subscription: { validUntil } } },
) => ({ validUntil }), {
  setSubscriptionDataAction: setSubscriptionData,
})(CancelSubscriptionModal);
