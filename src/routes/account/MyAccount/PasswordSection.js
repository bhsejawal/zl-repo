import { h } from 'preact';
import useFetch from 'use-http';
import classnames from 'classnames';
import { Box, Heading } from 'grommet';
import { get } from 'lodash-es';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { buildURL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";

import Accordion from '../Accordion';
import PasswordResetModal from '../../login/ResetModal';
import { showModal } from '../../login/ResetModal/actions';
import { passwordRegex } from '../../../helpers';
import { setUserData } from '../../../redux/actions';

import style from '../style.scss';

const PasswordSection = ({ expand = true, setUserDataAction, setShowModalAction }) => {
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [passwordConf, setPasswordConf] = useState();
  const [showCurrent, setShowCurrent] = useState();
  const [showNew, setShowNew] = useState();
  const [showConf, setShowConf] = useState();
  const [currentPasswordError, setCurrentPasswordError] = useState();
  const [newPasswordError, setNewPasswordError] = useState();
  const [passwordConfError, setPasswordConfError] = useState();

  const {
    post,
    error,
    data,
    loading,
  } = useFetch(buildURL('/users/account/password'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    const { user, passwordError, message } = data || {}

    if (user) {
      setUserDataAction(user);
      setCurrentPasswordError(false);
      setNewPasswordError(false);
      setPasswordConfError(false);
    }

    if (message) {
      setPasswordConfError(message);
    }

    if (error && passwordError) {
      setCurrentPasswordError(passwordError);
    }
  }, [error, data, setUserDataAction]);

  const updateHandler = async () => {
    if (!currentPassword) {
      setCurrentPasswordError('This field is required.');
      return;
    }

    if (!newPassword || !newPassword.match(passwordRegex)) {
      setNewPasswordError(true);
      return;
    }

    if ((newPassword !== passwordConf) || (newPassword && !passwordConf)) {
      setPasswordConfError('Passwords must match');
      return;
    }

    await post({ currentPassword, newPassword, passwordConf });
  };

  const currentPasswordChangeHandler = ({ target: { value }}) => {
    setCurrentPassword(value);
    if (value.length) {
      setCurrentPasswordError(false);
    }
  }

  const newPasswordChangeHandler = ({ target: { value }}) => {
    setNewPassword(value);
    if (newPasswordError && value.match(passwordRegex)) {
      setNewPasswordError(false);
    }
  }

  const passwordConfChangeHandler = ({ target: { value }}) => {
    setPasswordConf(value);
    if (passwordConfError && value === newPassword) {
      setPasswordConfError(false);
    }
  }

  const disableUpdate = !currentPassword || !newPassword || !passwordConf;

  return (
    <Accordion expanded={expand} header={<Heading level="4">Password</Heading>}>
      <Box>
        <Box
          direction="row"
          border={{color: '#DFDFDF', size: '1px', side: 'top'}}
          pad={{horizontal: '50px', top: '30px'}}
        >
          <div className={style.label}>
            <span>Current Password</span>
          </div>
          <div className={style.inputContainer}>
            <div className={style.inputWrapper}>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={currentPasswordChangeHandler}
                className={classnames({[style.errorBorder]: currentPasswordError})}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                <FontAwesomeIcon icon={showCurrent ? faEye : faEyeSlash } />
              </button>
            </div>
            <div className={classnames(style.errorSection, {[style.active]: currentPasswordError})}>
              {!currentPassword && currentPasswordError}
              {currentPassword && currentPasswordError && (
                <div>
                  <span>Password is incorrect</span>
                  <button
                    type="button"
                    onClick={() => setShowModalAction(true)}
                    className={style.passwordResetButton}>
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          </div>
        </Box>

        <Box
          direction="row"
          pad={{horizontal: '50px', top: '30px'}}
        >
          <div className={style.label}>
            <span>New Password</span>
          </div>
          <div className={style.inputContainer}>
            <div className={style.inputWrapper}>
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={newPasswordChangeHandler}
                className={classnames({[style.errorBorder]: newPasswordError})}
              />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                <FontAwesomeIcon icon={showNew ? faEye : faEyeSlash } />
              </button>
            </div>
            <div className={classnames(style.errorSection, {[style.active]: newPasswordError})}>
              Use a minimum of 8 characters with at least 1 number and 1 character
            </div>
          </div>
        </Box>

        <Box
          direction="row"
          pad={{horizontal: '50px', top: '30px'}}
        >
          <div className={style.label}>
            <span>Confirm Password</span>
          </div>
          <div className={style.inputContainer}>
            <div className={style.inputWrapper}>
              <input
                type={showConf ? 'text' : 'password'}
                value={passwordConf}
                onChange={passwordConfChangeHandler}
                className={classnames({[style.errorBorder]: passwordConfError})}
              />
              <button type="button" onClick={() => setShowConf(!showConf)}>
                <FontAwesomeIcon icon={showConf ? faEye : faEyeSlash } />
              </button>
            </div>
            <div className={classnames(style.errorSection, {[style.active]: passwordConfError})}>
              {passwordConfError}
            </div>
          </div>
        </Box>

        <PrimaryButton
          className={style.updateButton}
          onClick={updateHandler}
          margin={{horizontal: 'auto', top: '20px', bottom: '40px'}}
          primary
          label={get(data, 'user') ? 'Updated' : 'Update'}
          size="large"
          disabled={disableUpdate}
          loading={loading}
        />
      </Box>
      <PasswordResetModal />
    </Accordion>
  );
};

export default connect(
  ({ user: { email } }) => ({ userEmail: email }),
  {
    setUserDataAction: setUserData,
    setShowModalAction: showModal,
  },
)(PasswordSection);
