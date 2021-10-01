import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'preact/hooks';

import { connect } from 'react-redux';
import { Box, Text } from 'grommet';

import useFetch from 'use-http';
import { route } from 'preact-router';
import { loadStripe } from '@stripe/stripe-js/pure';
import { Experiment, Variant } from 'react-optimize';

import { buildURL } from 'Shared/fetch';
import PlanCard from 'Components/PlanCard';
import Dialog from 'Components/modals/Dialog';
import LoaderModal from 'Components/LoaderModal';

import { StripeContext } from 'Shared/context';

import UpdateSubscriptionDialog from './UpdateSubscriptionDialog';
import ClassPassDetailsModal from './ClassPassDetailsModal';

import { setPlans, setSubscriptionData } from '../../redux/actions';

import { useIsMobileSize } from '../../hooks';

import plansBackground from './plansBackground.jpg';

import style from './style.scss';

const defaultDialogSettings = {
  show: false,
  planId: null,
  priceId: null,
  action: null,
  interval: null,
}

const getBenefitText = (interval) => (interval === 'month'
  ? 'Enjoy new animals added every month'
  : 'With an annual membership');

const getBenefitTitle = (interval, discount) => (interval === 'month'
  ? 'Unlimited Access'
  : `Save ${discount}`);

const VariantA = ({
  plans,
  isSmallScreen,
  currentPlan,
  showFreemium,
  isPublicPage,
  goToSignup,
  openDetailsModalHandler,
}) => (
  <Box
    direction={isSmallScreen ? 'column' : 'row'}
    justify="center"
    align={isSmallScreen ? "center" : "start"}
    pad={{ horizontal: isSmallScreen ? 'xsmall' : 'medium' }}
    gap="medium"
    wrap={!isSmallScreen}
  >
    {plans.filter(({ price }) => [499, 999, 2599, 9799].includes(price)).map(({
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
      originalPrice,
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
        onClickHandler={() => {
          if (isPublicPage) {
            goToSignup(planProductId, priceId);
          } else {
            clickHandler();
          }
        }}
        disabled={disabled}
        originalPrice={originalPrice}
        showDetailsModal={name === 'Class Pass'}
        openDetailsModalHandler={openDetailsModalHandler}
      />
    ))}
    {(currentPlan === 'FREEMIUM' || showFreemium) && (
      <PlanCard
        key="freemium"
        planPrice="FREE"
        color="#C5D8FF"
        benefitText="Access a single Zoolife habitat"
        disabled={currentPlan}
        buttonLabel={currentPlan === 'FREEMIUM' ? 'Current' : 'Select'}
        onClickHandler={() => route('/signup')}
      />
    )}
  </Box>
);

const VariantB = ({
  plans,
  isSmallScreen,
  currentPlan,
  showFreemium,
  isPublicPage,
  goToSignup,
  openDetailsModalHandler,
}) => (
  <Box
    direction={isSmallScreen ? 'column' : 'row'}
    fill
    align="center"
    justify="center"
    gap="large"
    margin="auto"
    wrap={!isSmallScreen}
    pad={{ horizontal: isSmallScreen ? 'xsmall' : 'medium' }}
  >
    {plans.filter(({ price }) => ![999, 9799].includes(price)).map(({
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
      originalPrice,
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
        onClickHandler={() => {
          if (isPublicPage) {
            goToSignup(planProductId, priceId);
          } else {
            clickHandler();
          }
        }}
        disabled={disabled}
        originalPrice={originalPrice}
        showDetailsModal={name === 'Class Pass'}
        openDetailsModalHandler={openDetailsModalHandler}
      />
    ))}
    {(currentPlan === 'FREEMIUM' || showFreemium) && (
      <PlanCard
        key="freemium"
        planPrice="FREE"
        color="#C5D8FF"
        benefitText="Access a single Zoolife habitat"
        disabled={currentPlan}
        buttonLabel={currentPlan === 'FREEMIUM' ? 'Current' : 'Select'}
        onClickHandler={() => route('/signup')}
      />
    )}
  </Box>
);

const SubscriptionSection = ({
  plans = [],
  productId,
  isSubscriptionActive,
  subscriptionStatus,
  setPlansAction,
  setSubscriptionDataAction,
  showCancelCTA,
  showFreemium,
  isPublicPage,
}) => {
  const { stripe } = useContext(StripeContext);
  const isSmallScreen = useIsMobileSize();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showClassPassModal, setShowClassPassModal] = useState(false);
  const showCancelButton = useMemo(() => {
    if (['FREEMIUM', 'TRIAL'].includes(productId)) {
      return false;
    }
    if (!plans || !plans.length) {
      return false;
    }

    const dailyPlans = plans.filter(({ interval }) => interval === 'visit').map(({ productId: planProductId }) => planProductId);
    if (dailyPlans.includes(productId)) {
      return false;
    }
    return true;
  }, [productId, plans]);

  const mobileBackground = '#24412B';
  const desktopBackground = { image: `url(${plansBackground})`, size: 'cover', position: 'left bottom' };

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

  const goToSignup = useCallback(async (planId, priceId) => {
    route(`/signup?plan=${planId}&price=${priceId}`);
  }, [])

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

  const cancelSubscription = useCallback(async () => {
    try {
      const { subscriptionStatus } = await post('/users/subscription/unsubscribe');
      setSubscriptionDataAction(subscriptionStatus);
      setShowCancelDialog(true);
    } catch (err) {
      // TODO: display error modal;
      console.error(err);
    }
  }, [setSubscriptionDataAction, setShowCancelDialog, post])

  const openDialogHandler = (action, planId, priceId, interval) => {
    setDialogSettings({
      planId,
      priceId,
      action,
      interval,
      show: true,
    })
  }
  const openDetailsModalHandler = useCallback(() => {
    setShowClassPassModal(true);
  }, []);

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

    if (!productId || productId === 'TRIAL' || !isSubscriptionActive) {
      return plans.map(({
        productId: planProductId,
        priceId,
        color,
        discount,
        interval,
        name,
        order,
        price,
        originalPrice,
        title,
        description,
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
        benefitTitle: title,
        benefitText: description,
        clickHandler: () => checkoutHandler(planProductId, priceId),
        originalPrice,
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
          originalPrice,
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
          benefitTitle: interval === 'visit' ? '' : getBenefitTitle(interval),
          benefitText: interval !== 'visit' ? getBenefitText(interval) : 'Unlock everything for a full day',
          clickHandler: () => openDialogHandler('Renew', planProductId, priceId, interval),
          originalPrice,
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
      originalPrice,
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

      const benefitTitle = interval === 'visit' ? '' : getBenefitTitle(interval);
      const benefitText = interval !== 'visit' ? getBenefitText(interval) : 'Unlock everything for a full day';

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
        originalPrice,
      };
    }).filter(({ display }) => display);
  }, [
    plans,
    productId,
    subscriptionStatus,
    isSubscriptionActive,
    checkoutHandler,
    cancelSubscription,
  ]);

  return (
    <>
      {showClassPassModal && <ClassPassDetailsModal onClose={() => setShowClassPassModal(false)} />}
      {showCancelCTA && showCancelButton && (
        <Box background="#F9FCE7" pad={isSmallScreen ? 'large' : 'medium'} align="center" justify="center">
          <Text onClick={cancelSubscription} className={style.cancelText}>
            Looking to cancel your pass? Click here.
          </Text>
        </Box>
      )}
      <Box
        direction="column"
        height={{ min: 'max-content' }}
        alignSelf="center"
        pad={{ vertical: '38px' }}
        align="center"
        justify={ isSmallScreen ? 'center' : 'start' }
        background={ isSmallScreen ? mobileBackground : desktopBackground }
        fill
        flex={ !isSmallScreen && showCancelCTA ? { grow: 1 } : 'shrink' }
        style={{ height: isSmallScreen ? "fit-content" : "100%" }}
      >
        <Experiment id="N0zOeDdQRqCDZb_UEem9Dw">
          <Variant id="0">
            <VariantA
              plans={plansData}
              isSmallScreen={isSmallScreen}
              currentPlan={productId}
              showFreemium={showFreemium}
              isPublicPage={isPublicPage}
              goToSignup={goToSignup}
              openDetailsModalHandler={openDetailsModalHandler}
            />
          </Variant>
          <Variant id="1">
            <VariantB
              plans={plansData}
              isSmallScreen={isSmallScreen}
              currentPlan={productId}
              isPublicPage={isPublicPage}
              goToSignup={goToSignup}
              showFreemium={showFreemium}
              openDetailsModalHandler={openDetailsModalHandler}
            />
          </Variant>
        </Experiment>
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
      subscription: {
        productId,
        validUntil,
        status: subscriptionStatus,
        active: isSubscriptionActive,
      },
    },
  },
) => ({
  plans,
  productId,
  validUntil,
  subscriptionStatus,
  isSubscriptionActive,
}), {
  setPlansAction: setPlans,
  setSubscriptionDataAction: setSubscriptionData,
})(SubscriptionSection);
