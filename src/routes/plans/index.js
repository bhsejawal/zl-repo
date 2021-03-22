import { useContext, useEffect, useCallback } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';

import { loadStripe } from '@stripe/stripe-js/pure';

import { connect } from 'react-redux';
import useFetch from 'use-http';

import PlanCard from 'Components/PlanCard';
import Header from 'Components/Header';
import Loader from 'Components/async/Loader';

import { API_BASE_URL } from 'Shared/fetch';
import { StripeContext } from 'Shared/context';

import background from 'Assets/plansBackground.png';

import ZoolifeBenefits from './benefitsSection';

import { setPlans } from './actions';

const Plans = ({ plans, setPlansAction }) => {
  const { stripe } = useContext(StripeContext);
  const size = useContext(ResponsiveContext);
  const isLargeScreen = size === 'large';
  const {
    get,
    post,
    loading,
    error,
  } = useFetch(API_BASE_URL, { cachePolicy: 'no-cache', credentials: 'include' });
  const fetchPlans = useCallback(async () => {
    const plans = await get('/products');
    setPlansAction(plans);
  }, [get, setPlansAction]);

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

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans])

  return (
    <>
      <Header />
      {loading && <Loader fill />}
      {!loading && !error && (
        <Box
          margin={{ top: '60px' }}
          direction="column"
          height={{min: 'unset'}}
          flex="grow"
        >
          <Box
            flex="grow"
            background={{
              image: `url(${background})`,
              size: 'contain',
              position: 'bottom',
              repeat: 'no-repeat',
              attachment: 'fixed',
            }}
            >
            <Box pad={{ vertical: "large", horizontal: "35%" }}>
              <Heading level={1} textAlign="center" fill size="25px">
                Explore more #zoolife
              </Heading>
              <Text textAlign="center" size="16px">
                50% of your ticket directly funds conservation
                &amp; animal care efforts led by our AZA-accredited partners.
              </Text>
            </Box>
            <Box
              direction={['medium', 'large'].includes(size) ? 'row' : 'column'}
              fill
              align="center"
              justify="center"
              gap="large"
              margin={{top: 'small', bottom: 'medium' }}
              pad={{ top: !isLargeScreen ? 'small' : 'none' }}
            >
              {plans.map(({
                name,
                price,
                interval,
                color,
                benefits,
                productId,
                priceId,
                currency,
                discount,
              }) => (
                <PlanCard
                  key={productId}
                  planName={name}
                  planPrice={price}
                  planType={interval}
                  planId={productId}
                  priceId={priceId}
                  planCurrency={currency}
                  color={color}
                  benefits={benefits}
                  discount={discount}
                  checkoutHandler={checkoutHandler}
                />
              ))}
            </Box>
          </Box>
          <ZoolifeBenefits />
        </Box>
      )}
    </>
  );
};

export default connect(
  ({ plans: { plans } }) => ({ plans }),
  { setPlansAction: setPlans },
)(Plans);
