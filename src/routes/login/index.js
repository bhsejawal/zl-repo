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
import Button from '../../components/Button';

import style from './style.scss';

const Login = ({ logged, setUserDataAction }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [hasError, setHasError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (logged) {
      route('/', true);
    }
  }, [logged]);

  const onSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const url = buildURL('/admin/users/login');
      const { user } = await post(url, { email, password });
      setUserDataAction(user);
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
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className={classnames(style.errorSection, {[style.active]: hasError})}>
              {hasError}
            </div>
          </div>
          <Button className={style.submitBtn} submit variant="primary">Submit</Button>
          <br />
          <button className={style.reset} type="button" onClick={() => console.log('OPEN RESET POPUP')}>
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
    </div>
  );
};

export default connect(
  ({ user: { logged } }) => ({ logged }),
  { setUserDataAction: setUserData },
)(Login);
