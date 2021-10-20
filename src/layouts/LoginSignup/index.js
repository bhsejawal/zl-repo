import Carousel from './Carousel';

import './style.scss';

const LoginSignup = ({ children }) => (
  <div className="loginSignup">
    <Carousel />
    <div className="formSection">
      <div>
        {children}
      </div>
    </div>
  </div>
);

export default LoginSignup;
