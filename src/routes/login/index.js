import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { get } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import classnames from 'classnames';
import {
  Image,
  Box,
  Text,
  Anchor,
} from 'grommet';

import { buildURL, post } from 'Shared/fetch';
import SocialLoginBar from 'Components/SocialLoginBar';
import { PrimaryButton } from 'Components/Buttons';
import logo from 'Assets/zoolife.svg';

import PasswordResetModal from './ResetModal';
import Layout from '../../layouts/LoginSignup';

import { setUserData } from '../../redux/actions';
import { emailRegex } from '../../helpers';

import { showModal, validateToken } from './ResetModal/actions';

import style from './style.scss';

const Login = ({
  logged,
  profile,
  setUserDataAction,
  setShowModalAction,
  token, // from URL
  validateTokenAction,
}) => {
  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState();
  const [password, setPassword] = useState();
  const [hasError, setHasError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (logged && profile) {
      route('/', true);
    } else if (logged) {
      // users who have not followed the regular signup process
      // do not have profile set, redirecting them to generate one
      route('/profile', true);
    }
  }, [logged, profile]);

  useEffect(() => {
    if (token) {
      validateTokenAction(token);
    }
  }, [token, validateTokenAction]);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    let hasEmailError = false;
    let hasPasswordError = false;

    setEmailError();
    setHasError();

    if (!email || !password) {
      if (!email) {
        hasEmailError = true;
        setEmailError('Email cannot be empty');
      }

      if (!password) {
        hasPasswordError = true;
        setHasError('Password cannot be empty');
      }
    }

    if (!hasEmailError && !email?.match(emailRegex)) {
      hasEmailError = true;
      setEmailError('Invalid email');
    }

    if (!hasPasswordError && password?.length < 8) {
      hasPasswordError = true;
      setHasError('Invalid Password');
    }

    if (hasEmailError || hasPasswordError) {
      return;
    }

    try {
      const url = buildURL('/admin/users/login');
      const { user } = await post(url, { email, password });
      setUserDataAction(user);
      try {
        localStorage.setItem('returningUser', true);
      } catch (err) {
        console.warn('Local storage is not available.');
        console.error(err);
      }
    } catch (err) {
      console.error('Error while user logging in', err);
      if (err.statusCode === 401) {
        setHasError(get(err, 'body.error'));
      } else if (err.statusCode === 400) {
        setHasError('Wrong credentials, please try again.');
      } else {
        setHasError('Something went wrong. Please try again!');
      }
    }
  }

  const onUsernameChange = ({ target }) => {
    setEmail(target.value);
  };

  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  return (
    <Layout>
      <>
        <Box direction="row" align="center" height="40px">
          <Text size="xxlarge" responsive>
            Try
          </Text>
          <Box pad={{ horizontal: '10px'}} justify="center">
            <Image src={logo} alt="" />
          </Box>
          <Text size="xxlarge" responsive>
            free
          </Text>
        </Box>
        <Box fill="horizontal" margin={{ top: 'medium' }}>
          <form onSubmit={onSubmit}>
            <div className={style.inputContainer}>
              <span className={style.label}>Email</span>
              <div className={style.inputWrapper}>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={onUsernameChange}
                />
              </div>
              <div className={classnames(style.errorSection, {[style.active]: emailError})}>
                {emailError}
              </div>
            </div>
            <div className={style.inputContainer}>
              <span className={style.label}>Password</span>
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
              <div className={classnames(style.errorSection, {[style.active]: hasError})}>
                {hasError}
              </div>
            </div>
            <Box margin={{ bottom: 'large' }}>
              <Anchor className={style.reset} onClick={() => setShowModalAction(true)}>
                Forgot password?
              </Anchor>
            </Box>
            <PrimaryButton
              label="Get Started"
              type="submit"
            />
            <Box margin={{ vertical: "large" }}>
              <Text>
                Don&apos;t have an account?&nbsp;
                <Anchor href="/signup">Sign Up</Anchor>
              </Text>
            </Box>
            <div className={style.separator}>
              <hr />
              <span>or</span>
              <hr />
            </div>
          </form>
        </Box>
        <SocialLoginBar />
        <PasswordResetModal />
      </>
    </Layout>
  );
};

export default connect(
  ({ user: { logged, profile } }) => ({ logged, profile }),
  {
    setUserDataAction: setUserData,
    setShowModalAction: showModal,
    validateTokenAction: validateToken,
  },
)(Login);
