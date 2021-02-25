import { h } from 'preact';
import { useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { API_BASE_URL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import {
  Box, Form,
  Heading,
  Layer,
  Text,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import classnames from 'classnames';
import useFetch from 'use-http';

import { emailRegex } from '../../../helpers';
import { showModal, enableSubmit } from './actions';

import modalStyle from './modalStyle.scss';
import style from '../style.scss';

const PasswordResetModal = ({
  showModal,
  submitEnabled,
  invalidToken,
  showModalAction,
  enableSubmitAction,
}) => {
  const [email, setEmail] = useState();
  const [hasError, setHasError] = useState();
  const [sent, setSent] = useState();
  const {
    loading,
    error,
    post,
    response,
  } = useFetch(API_BASE_URL, { cachePolicy: 'no-cache' });

  if (!showModal) {
    return null;
  }

  const closeHandler = () => {
    setSent();
    setEmail();
    setHasError();
    showModalAction(false);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    setHasError(false);

    if (!email) {
      setHasError('Email is required');
      return;
    }

    if (!email.match(emailRegex)) {
      setHasError('Invalid email');
      return;
    }

    const { origin } = window.location;
    await post('/users/password/reset', { email, origin });

    if (response.ok) {
      setSent(true);
    }
  }

  const onEmailChange = ({ target }) => {
    setEmail(target.value);
    enableSubmitAction(!!target.value.match(emailRegex));
  };

  return (
    <Layer
      className={modalStyle.container}
      onEsc={closeHandler}
      onClickOutside={closeHandler}
    >
      <button onClick={closeHandler} type="button" className={modalStyle.close}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <Box align="center" width="290px" margin={{vertical: '30px', horizontal: '50px'}}>
        <Heading level="3" responsive>
          {invalidToken ? 'Password link expired' : 'Reset Password'}
        </Heading>
        <Text textAlign="center" margin={{bottom: '40px'}} size="large" color="var(--charcoalLight)" as="div">
          {
            invalidToken
              ? 'To protect your account, your password link has expired. Please try again.'
              : 'We’ll send you a link to reset your password to your email.'
          }
        </Text>
        <Form onSubmit={onSubmit}>
          <Box align="start" className={style.inputContainer}>
            <span className={style.label}>Your Email:</span>
            <Box margin={{bottom: '5px'}} className={style.inputWrapper}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={onEmailChange}
                className={classnames({[style.errorBorder]: hasError})}
              />
            </Box>
            <div className={classnames(style.errorSection, {[style.active]: hasError || error})}>
              {hasError}
              {error && 'Something went wrong. Please try again!'}
              {!error && !hasError && sent && <p>{response.data.message}</p>}
            </div>
            <br />
            <Box alignContent="center" margin={{bottom: '15px', horizontal: 'auto'}}>
              <PrimaryButton
                loading={loading}
                type="submit"
                disabled={!submitEnabled}
                size="large"
                label={!sent ? 'Reset Password' : 'Resend' }
              />
            </Box>
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default connect(
  ({
    passwordReset: {
      invalidToken,
      submitEnabled,
      showModal,
    },
  }) => ({ invalidToken, submitEnabled, showModal }),
  {
    showModalAction: showModal,
    enableSubmitAction: enableSubmit,
  },
)(PasswordResetModal);
