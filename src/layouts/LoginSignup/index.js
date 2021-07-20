import { h } from 'preact';
import classnames from 'classnames';
import Carousel from './Carousel';
import { useWindowResize } from '../../hooks';

import './style.scss';

const LoginSignup = ({ children, image, showCarousel }) => {
  const { width: windowWidth } = useWindowResize();

  return (
    <div className="loginSignup">
      <div className={classnames('imageSection', { hideForMobile: showCarousel })}>
        <img src={image} alt="" />
      </div>
      <div className="formSection">
        <div>
          {children}
        </div>
      </div>
      {showCarousel && windowWidth <= 768 && (<Carousel />)}
    </div>
  )
};

export default LoginSignup;
