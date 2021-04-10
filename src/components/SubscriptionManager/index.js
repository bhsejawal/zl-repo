import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'preact/hooks';

import { connect } from 'react-redux';
import { Box, ResponsiveContext } from 'grommet';

import useFetch from 'use-http';
import { route } from 'preact-router';
import { format } from "date-fns";
import { loadStripe } from '@stripe/stripe-js/pure';

import { buildURL } from 'Shared/fetch';
import background from 'Assets/plansBackground.png';
import PlanCard from 'Components/PlanCard';
import Dialog from 'Components/modals/Dialog';
import LoaderModal from 'Components/async/LoaderModal';

import { StripeContext } from 'Shared/context';

import UpdateSubscriptionDialog from './UpdateSubscriptionDialog';

import { setPlans, setSubscriptionData } from '../../redux/actions';

const defaultDialogSettings = {
  show: false,
  planId: null,
  priceId: null,
  action: null,
  interval: null,
}

const SubscriptionSection = ({
  plans,
  productId,
  validUntil,
  subscriptionStatus,
  setPlansAction,
  setSubscriptionDataAction,
}) => {
  const { stripe } = useContext(StripeContext);
  const size = useContext(ResponsiveContext);
  const isLargeScreen = size === 'large';
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [dialogSettings, setDialogSettings] = useState(defaultDialogSettings);

  const { get, post, loading } = useFetch(
    buildURL(),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const fetchPlans = useCallback(async () => {
    const plans = await get('/products');
    setPlansAction(plans);
  }, [get, setPlansAction]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans])

  const checkoutHandler = useCallback(async (planId, priceId) => {
    try {
      const session = await post(`/checkout/${planId}/${priceId}`);
      if (!stripe?.redirectToCheckout) {
        // in case theres a problem with loading stripe, we should try to load it again
        const localStripe = await loadStripe(process.env.PREACT_APP_STRIPE_PUBLIC_KEY);
        await localStripe.redirectToCheckout(session);
        return;
      }
      await stripe.redirectToCheckout(session);
    } catch (err) {
      console.error('Error trying to start checkout process', err);
      // TODO: display error modal
    }
  }, [post, stripe])

  const validUntilReadable = validUntil ? format(validUntil, 'MMMM dd, yyyy') : '';

  const cancelSubscription = async () => {
    try {
      const { subscriptionStatus } = await post('/users/subscription/unsubscribe');
      setSubscriptionDataAction(subscriptionStatus);
      setShowCancelDialog(true);
    } catch (err) {
      // TODO: display error modal;
      console.error(err);
    }
  }

  const openDialogHandler = (action, planId, priceId, interval) => {
    setDialogSettings({
      planId,
      priceId,
      action,
      interval,
      show: true,
    })
  }

  const onCancelHandler = () => {
    setDialogSettings(defaultDialogSettings);
  }

  const handleCancelDialogClose = () => {
    setShowCancelDialog(false);
    route('/map');
  }

  const plansData = useMemo(() => {
    if (!plans.length) {
      return [];
    }

    if (!productId || productId === 'TRIAL') {
      return plans.map(({
        productId: planProductId,
        priceId,
        color,
        discount,
        interval,
        name,
        order,
        price,
      }) => ({
        planProductId,
        priceId,
        color,
        discount,
        interval,
        name,
        order,
        price,
        currentPlan: false,
        label: 'Select',
        display: true,
        benefitTitle: interval !== 'visit' ? 'Auto-Renewing' : '',
        benefitText: interval !== 'visit' ? 'Cancel Anytime' : '24h Access',
        clickHandler: () => checkoutHandler(planProductId, priceId),
      }));
    }

    if (subscriptionStatus === 'canceled') {
      return plans
        .filter(({ productId: planProductId }) => (planProductId === productId))
        .map(({
          productId: planProductId,
          priceId,
          color,
          discount,
          interval,
          name,
          order,
          price,
        }) => ({
          planProductId,
          priceId,
          color,
          discount,
          interval,
          name,
          order,
          price,
          currentPlan: true,
          label: 'Renew',
          display: true,
          benefitTitle: 'Valid until',
          benefitText: validUntilReadable,
          clickHandler: () => openDialogHandler('Renew', planProductId, priceId, interval),
        }));
    }

    // Subscription is Active, so we will set each available option per plan
    const {
      price: currentPlanPrice,
      interval: currentPlanInterval,
    } = plans.find((plan) => productId === plan.productId);

    return plans.map(({
      productId: planProductId,
      priceId,
      color,
      discount,
      interval,
      name,
      order,
      price,
    }) => {
      const isCurrentPlan = planProductId === productId;
      let label;
      let clickHandler;
      let disabled = false;

      if (isCurrentPlan && interval !== 'visit') {
        label = 'Cancel';
        clickHandler = cancelSubscription;
      } else if (currentPlanPrice < price) {
        if (currentPlanInterval === 'visit') {
          label = 'Subscribe';
          clickHandler = () => checkoutHandler(planProductId, priceId);
        } else {
          label = 'Upgrade';
          clickHandler = () => openDialogHandler('Upgrade', planProductId, priceId, interval);
        }
      } else if (currentPlanPrice > price) {
        label = 'Downgrade';
        clickHandler = () => openDialogHandler('Downgrade', planProductId, priceId, interval);
      } else {
        // Current plan is visit so no action to take
        label = 'Current Pass'
        disabled = true;
      }

      let benefitText;
      if (isCurrentPlan && interval !== 'visit') {
        benefitText = validUntilReadable;
      } else if (interval !== 'visit') {
        benefitText = 'Cancel Anytime'
      }

      let benefitTitle;
      if (isCurrentPlan && interval !== 'visit') {
        benefitTitle = 'Auto-Renews:';
      } else if (interval !== 'visit') {
        benefitTitle = 'Auto-Renewing'
      } else {
        benefitTitle = '24h Access'
      }

      return {
        planProductId,
        priceId,
        color,
        discount,
        interval,
        name,
        order,
        price,
        currentPlan: isCurrentPlan,
        label,
        display: (currentPlanInterval !== 'visit' && interval !== 'visit') || currentPlanInterval === 'visit',
        benefitTitle,
        benefitText,
        clickHandler,
        disabled,
      };
    }).filter(({ display }) => display);
  }, [plans, productId, subscriptionStatus, checkoutHandler, validUntilReadable]);

  return (
    <>
      <Box
        fill={['medium', 'large'].includes(size)}
        responsive
        direction="column"
      >
        <Box
          fill
          basis="full"
          background={{
            image: `url(${background})`,
            size: 'contain',
            position: 'bottom',
            repeat: 'no-repeat',
            attachment: 'fixed',
          }}
        >
          <Box
            direction={['medium', 'large'].includes(size) ? 'row' : 'column'}
            fill
            align="center"
            justify="center"
            gap="large"
            margin={{top: 'small', bottom: 'medium' }}
            pad={{ top: !isLargeScreen ? 'small' : 'none' }}
          >
            {plansData.map(({
              name,
              price,
              interval,
              color,
              benefitTitle,
              benefitText,
              planProductId,
              priceId,
              currency,
              discount,
              currentPlan,
              label,
              clickHandler,
              disabled,
            }) => (
              <PlanCard
                key={planProductId}
                planName={name}
                planPrice={price}
                planType={interval}
                planId={planProductId}
                priceId={priceId}
                planCurrency={currency}
                color={color}
                benefitTitle={benefitTitle}
                benefitText={benefitText}
                discount={discount}
                currentPlan={currentPlan}
                buttonLabel={label}
                onClickHandler={clickHandler}
                disabled={disabled}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <UpdateSubscriptionDialog
        show={dialogSettings.show}
        planId={dialogSettings.planId}
        priceId={dialogSettings.priceId}
        action={dialogSettings.action}
        interval={dialogSettings.interval}
        onCancelHandler={onCancelHandler}
      />
      {showCancelDialog && (
        <Dialog
          title="Until next time."
          text="You will still be able to access Zoolife until your pass runs outs."
          buttonLabel="Back to Zoolife"
          onCancel={handleCancelDialogClose}
          onConfirm={handleCancelDialogClose}
        />)}
      {loading && (<LoaderModal />)}
    </>
  )
};

export default connect((
  {
    plans: { plans },
    user: {
      subscription: { productId, validUntil, status: subscriptionStatus },
    },
  },
) => ({
  plans,
  productId,
  validUntil,
  subscriptionStatus,
}), {
  setPlansAction: setPlans,
  setSubscriptionDataAction: setSubscriptionData,
})(SubscriptionSection);
