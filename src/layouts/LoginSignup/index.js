import { h } from 'preact';

import loginImage from './login.png';

import './style.scss';

const LoginSignup = ({ children }) => (
  <div className="loginSignup">
    <div className="imageSection">
      <img src={loginImage} alt="" />
    </div>
    <div className="formSection">
      {children}
    </div>
  </div>
);

export default LoginSignup;
