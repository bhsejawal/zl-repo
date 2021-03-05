import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import { route } from 'preact-router';
import { API_BASE_URL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import classnames from 'classnames';
import useFetch from 'use-http';

import { validateToken } from '../login/ResetModal/actions';
import { passwordRegex } from '../../helpers';

import style from '../login/style.scss';

const PasswordReset = ({ token, logged }) => {
  const [password, setPassword] = useState();
  const [passwordConf, setPasswordConf] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [passwordError, setPasswordError] = useState();
  const [passwordConfError, setPasswordConfError] = useState();
  const { loading, error, post } = useFetch(API_BASE_URL);

  useEffect(() => {
    if (!token && !logged) {
      route('/login');
    }

    if (logged) {
      route('/', true);
    }
  }, [token, logged]);

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (!password.match(passwordRegex)) {
      setPasswordError(true);
      return;
    }

    if (password !== passwordConf ) {
      setPasswordConfError(true);
      return;
    }

    const { success } = await post('/users/password/update', { token, password, passwordConf });
    if (success) {
      route('/login', true);
    }
  }

  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
    if (passwordError) {
      setPasswordError(!target.value.match(passwordRegex));
    }
  };

  const onPasswordConfChange = ({ target }) => {
    setPasswordConf(target.value);
    if (passwordConfError) {
      setPasswordConfError(target.value !== password);
    }
  };

  return (
    <div className={style.login}>
      <div className={style.image}>
        <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/LoginMap.png" alt="" />
      </div>
      <div className={style.formWrapper}>
        <h1>
          <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/loginZoolifeLogo.svg" alt="" />
          <br />
          <span>Reset Password</span>
        </h1>
        <form onSubmit={onSubmit}>
          <div className={style.inputContainer}>
            <span className={style.label}>New Password:</span>
            <div className={style.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={onPasswordChange}
                className={classnames({[style.errorBorder]: passwordError})}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash } />
              </button>
            </div>
            <div
              className={classnames(style.errorSection, {
                [style.active]: passwordError,
                [style.valid]: !passwordError,
              })}
            >
              Use a minimum of 8 characters with at least 1 number and 1 character
            </div>
          </div>
          <br />
          <div className={style.inputContainer}>
            <span className={style.label}>Confirm New Password:</span>
            <div className={style.inputWrapper}>
              <input
                type={showPasswordConf ? 'text' : 'password'}
                value={passwordConf}
                onChange={onPasswordConfChange}
                className={classnames({[style.errorBorder]: passwordConfError})}
              />
              <button type="button" onClick={() => setShowPasswordConf(!showPasswordConf)}>
                <FontAwesomeIcon icon={showPasswordConf ? faEye : faEyeSlash } />
              </button>
            </div>
            <div className={classnames(style.errorSection, {
              [style.active]: passwordConfError || error,
            })}>
              {!error ? 'Passwords must match' : 'Something went wrong, please try again!'}
            </div>
          </div>
          <PrimaryButton loading={loading} label="Submit" type="submit" className={style.submitBtn} />
        </form>
      </div>
    </div>
  );
};

export default connect(
  ({ user: { logged }, passwordReset: { token } }) => ({ logged, token }),
  { validateTokenAction: validateToken },
)(PasswordReset);
