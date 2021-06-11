import { h } from 'preact';

import './style.scss';

const LoginSignup = ({ children, image }) => (
  <div className="loginSignup">
    <div className="imageSection">
      <img src={image} alt="" />
    </div>
    <div className="formSection">
      <div>
        {children}
      </div>
    </div>
  </div>
);

export default LoginSignup;
