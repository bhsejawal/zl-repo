import { h } from 'preact';

import loginImage from './login.png';

import './style.scss';

const LoginSignup = ({ children }) => (
  <div className="loginSignup">
    <div className="imageSection">
      <img src={loginImage} alt="" />
    </div>
    <div className="formSection">
      <div>
        {children}
      </div>
    </div>
  </div>
);

export default LoginSignup;
