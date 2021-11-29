import classNames from 'classnames';
import Carousel from './Carousel';

import './style.scss';

const LoginSignup = ({ children, className }) => (
  <div className="loginSignup">
    <Carousel />
    <div className={classNames("formSection", className)}>
      <div>
        {children}
      </div>
    </div>
  </div>
);

export default LoginSignup;
