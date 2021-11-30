import { Box, Heading, Text } from 'grommet';
import { route } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';
import useFetch from 'use-http';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { PrimaryButton } from 'Components/Buttons';
import LoaderModal from 'Components/LoaderModal';

import { buildURL } from 'Shared/fetch';
import { logPageViewGA } from 'Shared/ga';

import { setUserData } from '../../redux/actions';
import Layout from '../../layouts/LoginSignup';
import style from './style.scss';

const initialErrorState = { show: false, message: '' };

const Redeem = ({ setUserDataAction }) => {
  const [code, setCode] = useState('');
  const [errorState, setErrorState] = useState(initialErrorState);
  const [showLoader, setShowLoader] = useState(false);

  const {
    post,
    data,
    response,
    error,
  } = useFetch(
    buildURL('/redeem'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onClickHandler = async () => {
    setShowLoader(true);
    setErrorState(initialErrorState);
    const result = await post({ code });
    if (response.ok) {
      const { user, productId, price } = result;
      logPageViewGA('/checkout-completed', true);
      logPageViewGA(`/purchased-${productId}`);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'CheckoutCompleted');
        window.fbq('trackCustom', `Purchased${productId}`);
        window.fbq('track', 'Purchase', { currency: "USD", value: price, passType: productId });
      }

      setUserDataAction(user);
      setShowLoader(false);
      route('/welcome', true);
    }
  }

  useEffect(() => {
    if (error) {
      setErrorState({ show: true, message: data?.error || 'Something went wrong. Please, contact support' });
      setShowLoader(false);
    }
  }, [error, data]);

  return (
    <Layout>
      <Box width="450px">
        <Heading level="1" margin={{ bottom: '33px' }}>Almost there!</Heading>
        <Text color="var(--charcoal)" size="large" margin={{ bottom: '7px' }}>
          Enter your Gift Card Code
        </Text>
        <input
          onChange={(evt) => setCode(evt.target.value)}
          value={code}
          className={classnames(style.input, { [style.error]: errorState.show })}
          placeholder="Gift Card Code"
        />
        <div className={style.errorMessageWrapper}>
          {errorState.show && (<span className={style.errorMessage}>{errorState.message}</span>)}
        </div>
        <Box width="150px" margin={{ top: '33px' }}>
          <PrimaryButton onClick={onClickHandler} label="Get Started" disabled={!code || showLoader} />
        </Box>
      </Box>
      {showLoader && <LoaderModal />}
    </Layout>
  )
}

export default connect(null, { setUserDataAction: setUserData })(Redeem);
