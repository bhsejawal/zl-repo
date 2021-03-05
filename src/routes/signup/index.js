import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import { Heading} from 'grommet';
import { buildURL, post } from 'Shared/fetch';
import classnames from 'classnames';
import SocialLoginButton from 'Components/SocialLoginButton';

import { setUserData } from '../../redux/actions';
import { emailRegex, passwordRegex } from '../../helpers';
import Button from '../../components/Button';

import style from '../login/style.scss';

const Signup = ({ logged, setUserDataAction }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [serverError, setServerError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (logged) {
      route('/', true);
    }
  }, [logged]);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setPasswordError();
    setEmailError();

    if (!email.match(emailRegex)) {
      setEmailError('Invalid email');
      return;
    }

    if (!password.match(passwordRegex)) {
      setPasswordError('Invalid password');
      return;
    }

    try {
      const url = buildURL('/users/signup');
      const {
        user,
        passwordError,
        emailError,
        error,
      } = await post(url, { email, password });

      if (passwordError) {
        setPasswordError(error);
      } else if (emailError) {
        setEmailError(error);
      } else if (error) {
        setServerError(error); // recheck
      } else if (user) {
        setServerError();
        setUserDataAction(user);
        route('/profile', true);
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

  return (
    <div className={style.login}>
      <div className={style.image}>
        <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/LoginMap.png" alt="" />
      </div>
      <div className={style.formWrapper}>
        <Heading margin={{top: '30px', bottom: '5px'}} level="4" color="var(--grey)">Step 1 of 2</Heading>
        <Heading margin={{top: '0', bottom: '32px'}} level="1">
          <span>Try</span>
          <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/loginZoolifeLogo.svg" alt="" />
        </Heading>
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
          <Button className={style.submitBtn} submit variant="primary">Submit</Button>
          <br />
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
)(Signup);
