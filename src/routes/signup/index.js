import { h } from 'preact';
import { useState, useContext, useEffect } from 'preact/hooks';
import { Link, route } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import {
  Heading,
  Image,
  Box,
  Text,
  CheckBox,
  ResponsiveContext,
} from 'grommet';
import { buildURL, post } from 'Shared/fetch';
import classnames from 'classnames';
import SocialLoginBar from 'Components/SocialLoginBar';
import logo from 'Components/ZoolifeLogo/zoolife.svg';
import { PrimaryButton } from 'Components/Buttons';
import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { logPageViewGA } from 'Shared/ga';

import { setUserData } from '../../redux/actions';
import {
  emailRegex,
  passwordRegex,
  getDeviceType,
  getCampaignData,
  logPageView,
} from '../../helpers';

import Layout from '../../layouts/LoginSignup';

import signupImage from './zoolife-signup.jpeg';

import style from '../login/style.scss';

const TERMS_VERSION = process.env.PREACT_APP_TERMS_VERSION ?? 1;

const Signup = ({
  logged,
  setUserDataAction,
  openTermsModalAction,
  matches,
}) => {
  const size = useContext(ResponsiveContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [serverError, setServerError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState();

  useEffect(() => {
    const { socialLoginError = false } = matches;
    if (socialLoginError && !emailError) {
      setEmailError('Error logging in with social media. Make sure you share your email to proceed.');
    }
  }, [matches]);

  if (logged) {
    return route('/map', true);
  }

  const isLargeScreen = size === 'large';

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setPasswordError();
    setEmailError();
    setTermsError();

    if (!email.match(emailRegex)) {
      setEmailError('Invalid email');
      return;
    }

    if (!password.match(passwordRegex)) {
      setPasswordError('Invalid password');
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
      const {
        user,
        passwordError,
        emailError,
        error,
      } = await post(url, {
        email,
        password,
        origin,
        termsVersion,
        referralData,
      });

      if (passwordError) {
        setPasswordError(error);
      } else if (emailError) {
        setEmailError(error);
      } else if (error) {
        setServerError(error); // recheck
      } else if (user) {
        setServerError();
        setUserDataAction(user);
        logPageView('/signed-up');
        logPageViewGA('/signed-up');
        if (origin === 'phone') {
          route('/mobile', true);
        } else {
          route('/profile', true);
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

  return (
    <Box fill width={{ max: "1650px", min: "350px" }} height={{ min: 'max-content' }} margin={{ horizontal: 'auto' }}>
      <Layout image={signupImage}>
        {isLargeScreen && (
          <Heading margin={{top: '30px', bottom: '5px'}} level="4" color="var(--grey)">Step 1 of 2</Heading>
        )}
        <Box direction="row" align="center" height="40px" margin={{ top: !isLargeScreen ? 'xlarge' : ''}}>
          <Heading level="2">
            Try
          </Heading>
          <Box pad={{ horizontal: '10px'}} justify="center">
            <Image src={logo} alt="" />
          </Box>
          <Heading level="2">
            free
          </Heading>
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
                  placeholder="Password"
                  value={password}
                  onChange={onPasswordChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash } />
                </button>
              </div>
              <div
                className={classnames(style.errorSection, {
                  [style.active]: passwordError || serverError,
                })}
              >
                {serverError || 'Use a minimum of 8 characters with at least 1 number and 1 character'}
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
        <Box margin={{ top: "30px", bottom: '20px' }}>
          <Text>
            Already have an account?&nbsp;
            <Link href="/login" className="small">Log In</Link>
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
  ({ user: { logged } }) => ({ logged }),
  {
    setUserDataAction: setUserData,
    openTermsModalAction: openTermsModal,
  },
)(Signup);
