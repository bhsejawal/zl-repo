import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
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
  Heading,
} from 'grommet';

import { buildURL, post } from 'Shared/fetch';
import SocialLoginBar from 'Components/SocialLoginBar';
import { PrimaryButton } from 'Components/Buttons';
import logo from 'Components/ZoolifeLogo/zoolife.svg';

import PasswordResetModal from './ResetModal';
import Layout from '../../layouts/LoginSignup';

import { setUserData } from '../../redux/actions';
import { emailRegex, identifyUser, loadPage } from '../../helpers';

import { showModal, validateToken } from './ResetModal/actions';

import loginImage from './login.png';

import style from './style.scss';

const Login = ({
  setUserDataAction,
  setShowModalAction,
  token, // from URL
  validateTokenAction,
  matches,
}) => {
  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState();
  const [password, setPassword] = useState();
  const [hasError, setHasError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const { socialLoginError = false } = matches;
    if (socialLoginError && !hasError) {
      setHasError(true);
      setEmailError('Error logging in with social media. Make sure you share your email to proceed.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

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
      setUserDataAction({ ...user, sessionChecked: true });
      identifyUser(user);
      loadPage('/map');
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
    <Box fill width={{ max: "1650px", min: "350px" }} height={{ min: 'max-content' }}>
      <Layout image={loginImage}>
        <Box direction="row" align="center" height="auto">
          <Heading level="2">
            Welcome back
            <br />
            to
            <Box pad={{ horizontal: '10px'}} justify="center" style={{ display: 'inline-flex'}}>
              <Image src={logo} alt="" />
            </Box>
          </Heading>
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
              <Anchor onClick={() => setShowModalAction(true)}>
                Forgot password?
              </Anchor>
            </Box>
            <PrimaryButton
              label="Log in"
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
      </Layout>
    </Box>
  );
};

export default connect(
  null,
  {
    setUserDataAction: setUserData,
    setShowModalAction: showModal,
    validateTokenAction: validateToken,
  },
)(Login);
