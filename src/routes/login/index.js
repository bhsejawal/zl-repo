import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { get } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import { buildURL, post } from 'Shared/fetch';
import SocialLoginButton from 'Components/SocialLoginButton';
import classnames from 'classnames';

import { setUserData } from '../../redux/actions';
import {showModal, validateToken} from './ResetModal/actions';

import Button from '../../components/Button';
import PasswordResetModal from './ResetModal';

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
    <div className={style.login}>
      <div className={style.image}>
        <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/LoginMap.png" alt="" />
      </div>
      <div className={style.formWrapper}>
        <h1>
          <span>Log into</span>
          <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/loginZoolifeLogo.svg" alt="" />
        </h1>
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
            <div className={style.errorSection} />
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
          <Button className={style.submitBtn} submit variant="primary">Submit</Button>
          <br />
          <button className={style.reset} type="button" onClick={() => setShowModalAction(true)}>
            Forgot password?
          </button>
          <div className={style.separator}>
            <hr />
            <span>or</span>
            <hr />
          </div>
        </form>
        <div className={style.socialLogin}>
          <SocialLoginButton variant="facebook" />
          <SocialLoginButton variant="google" />
        </div>
      </div>
      <PasswordResetModal />
    </div>
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
