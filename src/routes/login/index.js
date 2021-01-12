import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { setUserData } from '../../redux/actions';

import { buildURL, post } from '../../shared/fetch';

import style from './style.scss';

const Login = ({ logged, setUserDataAction }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [hasError, setHasError] = useState();

  useEffect(() => {
    if (logged) {
      route('/', true);
    }
  }, [logged]);

  const onSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const url = buildURL('/admin/users/login');
      const { error, user } = await post(url, { username, password });

      if (error) {
        throw new Error(error);
      }

      setUserDataAction(user);
    } catch (err) {
      console.error(err);
      setHasError(true);
    }
  }

  const onUsernameChange = ({ target }) => {
    setUsername(target.value);
  };

  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  return (
    <div className={style.login}>
      <form onSubmit={onSubmit}>
        {hasError && (<p style={{ color: 'red' }}>There was an error. Please try again.</p>)}
        <div className={style.input}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onUsernameChange}
          />
        </div>
        <div className={style.input}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default connect(
  ({ user: { logged } }) => ({ logged }),
  { setUserDataAction: setUserData },
)(Login);
