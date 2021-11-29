import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'preact/hooks';

import { connect } from 'react-redux';
import { isEmpty } from 'lodash-es';
import { Box, Text } from 'grommet';

import useFetch from 'use-http';
import { route } from 'preact-router';
import { loadStripe } from '@stripe/stripe-js/pure';

import { buildURL } from 'Shared/fetch';
import PlanCard from 'Components/PlanCard';
import Dialog from 'Components/modals/Dialog';
import LoaderModal from 'Components/LoaderModal';

import { StripeContext } from 'Shared/context';

import UpdateSubscriptionDialog from './UpdateSubscriptionDialog';
import ClassPassDetailsModal from './ClassPassDetailsModal';
import CancelSubscriptionModal from './CancelSubscriptionModal';

import { setPlans } from '../../redux/actions';

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

const SubscriptionSection = ({
  plans = [],
  productId,
  isSubscriptionActive,
  subscriptionStatus,
  validUntil,
  setPlansAction,
  showCancelCTA,
  showFreemium,
  isPublicPage,
  showGiftExplore = true,
  showGiftUserPlan = false,
}) => {
  const { stripe } = useContext(StripeContext);
  const isSmallScreen = useIsMobileSize();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showClassPassModal, setShowClassPassModal] = useState(false);
  const [userPlanData, setUserPlanData] = useState(null);
  const showCancelButton = useMemo(() => {
    if (['FREEMIUM', 'TRIAL'].includes(productId)) {
      return false;
    }

    if (isEmpty(plans)) {
      return false;
    }

    // prevent canceling a canceled status
    if (subscriptionStatus === 'canceled') {
      return false;
    }

    // prevent canceling a subscription in the past
    if (new Date(validUntil) < new Date()) {
      return false;
    }

    const dailyPlans = plans.filter(({ interval }) => interval === 'visit').map(({ productId: planProductId }) => planProductId);
    if (dailyPlans.includes(productId)) {
      return false;
    }
    return true;
  }, [productId, plans, subscriptionStatus, validUntil]);

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

  const fetchUserPlan = useCallback(async () => {
    if (showGiftUserPlan) {
      const userPlan = await get('/users/product');
      setUserPlanData(userPlan);
    }
  }, [get, setUserPlanData, showGiftUserPlan]);

  useEffect(() => {
    fetchPlans();
    fetchUserPlan();
  }, [fetchPlans, fetchUserPlan])

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

    let currentPlanPrice = null;
    let currentPlanInterval = null;

    const currentPlan = plans.find((plan) => productId === plan.productId);

    if (currentPlan) {
      currentPlanPrice = currentPlan.price;
      currentPlanInterval = currentPlan.interval;
    }

    if (!productId || productId === 'TRIAL' || !isSubscriptionActive || !currentPlan) {
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
          currentPlan: true,
          label: 'Renew',
          display: true,
          benefitTitle: interval === 'visit' ? '' : title,
          benefitText: interval !== 'visit' ? description : 'Unlock everything for a full day',
          clickHandler: () => openDialogHandler('Renew', planProductId, priceId, interval),
          originalPrice,
        }));
    }

    // Subscription is Active, so we will set each available option per plan
    return plans.map(({
      productId: planProductId,
      priceId,
      title,
      description,
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
        clickHandler = () => setShowCancelModal(true);
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

      const benefitTitle = interval === 'visit' ? '' : title;
      const benefitText = interval !== 'visit' ? description : 'Unlock everything for a full day';

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
  ]);

  return (
    <>
      {showClassPassModal && <ClassPassDetailsModal onClose={() => setShowClassPassModal(false)} />}
      {showCancelCTA && showCancelButton && (
        <Box background="#F9FCE7" pad={isSmallScreen ? 'large' : 'medium'} align="center" justify="center">
          <Text onClick={() => setShowCancelModal(true)} className={style.cancelText}>
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
        <Box
          direction={isSmallScreen ? 'column' : 'row'}
          justify="center"
          align={isSmallScreen ? "center" : "start"}
          pad={{ horizontal: isSmallScreen ? 'xsmall' : 'medium' }}
          gap="medium"
          wrap={!isSmallScreen}
        >
          {showGiftUserPlan && userPlanData?.type === 'giftCard' && (
            <PlanCard
              key="gift-card"
              planType="Gift"
              planPrice="Free"
              planTitle="Zoolife"
              planSubtitle={userPlanData.description}
              color="#FFEAB5"
              benefitTitle="Unlimited Access"
              disabled
              benefitText={userPlanData.daysLeft > 0 ? `${userPlanData.daysLeft} days left` : 'Expired'}
              buttonLabel="Current"
              onClickHandler={() => route('/gift')}
            />
          )}
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
          {(productId === 'FREEMIUM' || showFreemium) && (
            <PlanCard
              key="freemium"
              planPrice="FREE"
              color="#C5D8FF"
              benefitText="Access a single Zoolife habitat"
              disabled={!!productId}
              buttonLabel={productId === 'FREEMIUM' ? 'Current' : 'Select'}
              onClickHandler={() => route('/signup')}
            />
          )}
          {showGiftExplore && (
            <PlanCard
              key="gift-card"
              planType="Gift"
              planPrice="Free"
              planTitle="Zoolife"
              planSubtitle="Gift Card"
              color="#FFEAB5"
              benefitTitle="Starting at $23.99"
              benefitText="The perfect gift for any nature lover."
              buttonLabel="Explore"
              onClickHandler={() => route('/gift')}
            />
          )}

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
      {loading && (<LoaderModal background="transparent" />)}
      {showCancelModal && (<CancelSubscriptionModal onClose={() => setShowCancelModal(false)} />)}
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
})(SubscriptionSection);
