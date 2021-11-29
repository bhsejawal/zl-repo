import { h } from 'preact';
import {
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'preact/hooks';
import { Link, route } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import {
  Heading,
  Box,
  Text,
  CheckBox,
} from 'grommet';
import { loadStripe } from '@stripe/stripe-js/pure';

import { buildURL, post } from 'Shared/fetch';
import classnames from 'classnames';
import SocialLoginBar from 'Components/SocialLoginBar';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { logPageViewGA } from 'Shared/ga';

import { StripeContext } from 'Shared/context';

import { setUserData } from '../../redux/actions';
import {
  emailRegex,
  passwordRegex,
  getDeviceType,
  getCampaignData,
  loadPage,
} from '../../helpers';

import Layout from '../../layouts/LoginSignup';

import style from '../login/style.scss';

const TERMS_VERSION = process.env.PREACT_APP_TERMS_VERSION ?? 1;

const Signup = ({
  setUserDataAction,
  openTermsModalAction,
  matches,
  logged,
  sessionChecked,
}) => {
  const { stripe } = useContext(StripeContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [serverError, setServerError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [termsError, setTermsError] = useState();

  const checkoutHandler = useCallback(async (planId, priceId) => {
    try {
      const session = await post(buildURL(`/checkout/${planId}/${priceId}`));
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
  }, [stripe])

  useEffect(() => {
    const { socialLoginError = false } = matches;
    if (socialLoginError && !emailError) {
      setEmailError('Error logging in with social media. Make sure you share your email to proceed.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  useEffect(() => {
    if (logged) {
      loadPage('/map', true);
    }
  }, [logged]);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setPasswordError();
    setEmailError();
    setTermsError();

    if (!email.match(emailRegex)) {
      setEmailError('Invalid email');
      return;
    }

    if (!password.length) {
      setPasswordError('Password is required');
      return;
    }

    if (!password.match(passwordRegex)) {
      setPasswordError('8+ characters with at least 1 number');
      return;
    }

    if (!isTermsAccepted) {
      setTermsError('Please agree to Zoolife\'s Terms & Privacy to continue.');
      return;
    }

    try {
      const url = buildURL('/users/signup');
      const origin = getDeviceType();
      const termsVersion = TERMS_VERSION;
      const referralData = getCampaignData();
      const { userAgent } = navigator;
      const { searchParams } = new URL(document.location);
      const plan = searchParams.get('plan');
      const price = searchParams.get('price');
      const isGiftCardUser = searchParams.get('isGiftCardUser');

      const {
        user,
        planData,
        passwordError,
        emailError,
        error,
      } = await post(url, {
        email,
        password,
        origin,
        termsVersion,
        referralData: { ...referralData, userAgent, isGiftCardUser },
        planData: { plan, price },
      });

      if (passwordError) {
        setPasswordError(error);
      } else if (emailError) {
        setEmailError(error);
      } else if (error) {
        setServerError(error);
      } else if (user) {
        logPageViewGA('/signed-up', false, false);
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', 'SignedUp')
        }
        const { plan, price } = planData;
        if (plan && price) {
          checkoutHandler(plan, price);
          return;
        }
        setServerError();
        setUserDataAction(user);
        if (isGiftCardUser) {
          loadPage('/redeem');
        } else {
          loadPage('/profile');
        }
        try {
          localStorage.setItem('returningUser', true);
        } catch (err) {
          console.warn('Local storage is not available.');
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
      setServerError('Something went wrong, please try again.');
    }
  }

  const onEmailChange = ({ target }) => {
    setEmail(target.value);
    if (emailError) {
      setEmailError(!target.value.match(emailRegex) ? emailError : undefined);
    }
  };

  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
    if (passwordError) {
      setPasswordError(!target.value.match(passwordRegex) ? passwordError : undefined);
    }
  };

  const onTermsAndPrivacyClick = (evt, type) => {
    evt.preventDefault();
    openTermsModalAction(false, type);
  };

  const onLogin = () => {
    route('/login');
  }

  if (!sessionChecked || logged) {
    return null;
  }

  return (
    <Box fill width={{ max: 'var(--maxWidth)', min: '350px' }} height={{ min: 'max-content' }} margin={{ horizontal: 'auto' }}>
      <Box direction="row" align="center" background="none" className={style.topNavigationContainer}>
        <Text>
          Have an account?
        </Text>
        <OutlineButton size="medium" label="Sign In" height="30px" margin={{ left: '16px' }} width={{ min: '85px' }} onClick={onLogin} />
      </Box>
      <Layout>
        <Box direction="row" align="center" height="auto">
          <Heading level="2">Try zoolife free.</Heading>
        </Box>
        <Box fill="horizontal" margin={{ top: 'medium' }}>
          <form onSubmit={onSubmit}>
            <div className={style.inputContainer}>
              <span className={style.label}>Your Email:</span>
              <div className={style.inputWrapper}>
                <input
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={onEmailChange}
                  className={classnames({[style.errorBorder]: emailError})}
                  style={{ fontSize: (!email ? '11px' : '20px') }}
                />
              </div>
              <div className={classnames(style.errorSection, {[style.active]: emailError})}>
                {emailError}
              </div>
            </div>
            <div className={style.inputContainer}>
              <span className={style.label}>Your Password:</span>
              <div className={style.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="8+ characters with at least 1 number"
                  value={password}
                  onChange={onPasswordChange}
                  className={classnames({[style.errorBorder]: passwordError})}
                  style={{ fontSize: (!password ? '11px' : '20px') }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash } />
                </button>
              </div>
              <div className={classnames(style.errorSection, style.active)}>
                {passwordError || serverError}
              </div>
            </div>
            <Box margin={{ top: 'medium' }} className={classnames({ error: termsError })}>
              <CheckBox
                label={(
                  <Box>
                    <Text>
                      I agree to Zoolife&apos;s&nbsp;
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <Link href="#" className="small" onClick={(evt) => onTermsAndPrivacyClick(evt, 'terms')}>
                        Terms &amp; Conditions
                      </Link>
                      &nbsp;&amp;&nbsp;
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <Link href="#" className="small" onClick={(evt) => onTermsAndPrivacyClick(evt, 'privacy')}>
                        Privacy Policy
                      </Link>
                    </Text>
                  </Box>
                )}
                checked={isTermsAccepted}
                onChange={(event) => setIsTermsAccepted(event.target.checked)}
              />
              <div className={classnames(style.errorSection, {[style.active]: termsError})}>
                {termsError}
              </div>
            </Box>
            <PrimaryButton type="submit" label="Get Started!" />
            <br />
          </form>
        </Box>
        <Box margin={{ top: '30px', bottom: '20px' }} className={style.navigationContainer}>
          <Text>
            Have an account?&nbsp;
            <Link href="/login" className="small">Sign In</Link>
          </Text>
        </Box>

        <Box>
          <div className={style.separator}>
            <hr />
            <span>or</span>
            <hr />
          </div>
        </Box>
        <SocialLoginBar />
        <Box margin={{ top: 'medium' }}>
          <Text>
            By using social signup, I agree to&nbsp;
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link href="#" className="small" onClick={(evt) => onTermsAndPrivacyClick(evt, 'terms')}>
              Terms
            </Link>
            &nbsp;&amp;&nbsp;
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link href="#" className="small" onClick={(evt) => onTermsAndPrivacyClick(evt, 'privacy')}>
              Privacy
            </Link>
          </Text>
        </Box>
      </Layout>
    </Box>
  );
};

export default connect(
  ({ user: { logged, sessionChecked } }) => ({ logged, sessionChecked }),
  {
    setUserDataAction: setUserData,
    openTermsModalAction: openTermsModal,
  },
)(Signup);
