import { h } from 'preact';
import useFetch from 'use-http';
import classnames from 'classnames';
import { Box, Heading } from 'grommet';
import { get } from 'lodash-es';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { buildURL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';

import Accordion from '../Accordion';
import { emailRegex } from '../../../helpers';
import { setUserData } from '../../../redux/actions';

import style from '../style.scss';

const EmailSection = ({ expand = true, userEmail, setUserDataAction }) => {
  const [email, setEmail] = useState(userEmail);
  const [hasError, setHasError] = useState();
  const {
    post,
    error,
    data,
    loading,
  } = useFetch(buildURL('/users/account/email'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    const user = get(data, 'user');
    const message = get(data, 'error');

    if (error || message) {
      setHasError(message || 'Something Went Wrong, please try again!');
    } else if (user) {
      setUserDataAction(user);
      setHasError(false);
    }
  }, [error, data, setUserDataAction]);

  const changeHandler = ({ target: { value }}) => {
    setEmail(value);
  }

  const updateHandler = async () => {
    if (!email.match(emailRegex)) {
      setHasError('Invalid email.');
      return;
    }

    await post({ email });
  };

  return (
    <Accordion expanded={expand} header={<Heading level="4">Email</Heading>}>
      <Box>
        <Box
          direction="row"
          border={{color: '#DFDFDF', size: '1px', side: 'top'}}
          pad={{ horizontal: '50px', top: '30px', bottom: '40px' }}
        >
          <div className={style.label}>
            <span>Email</span>
            <div className={style.note}>
              We’ll send event reminders and your photos/clips to this email address.
            </div>
          </div>
          <div className={style.inputContainer}>
            <div className={style.inputWrapper}>
              <input
                type="text"
                name="email"
                placeholder="email@example.com"
                value={email}
                onChange={changeHandler}
                className={classnames({[style.errorBorder]: hasError})}
              />
            </div>

            <div className={classnames(style.errorSection, {[style.active]: hasError})}>
              {hasError}
            </div>

            <Box margin={{ top: '30px' }} />

            <PrimaryButton
              className={style.updateButton}
              onClick={updateHandler}
              primary
              label={get(data, 'user.email') === email ? 'Updated' : 'Update'}
              size="large"
              loading={loading}
            />
          </div>
        </Box>
      </Box>
    </Accordion>
  );
};

export default connect(
  ({ user: { email } }) => ({ userEmail: email }),
  { setUserDataAction: setUserData },
)(EmailSection);
