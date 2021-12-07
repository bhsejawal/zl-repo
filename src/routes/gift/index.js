import classnames from 'classnames';

import Header from '../home/Header';
import Carousel from '../../layouts/LoginSignup/Carousel';

import style from './style.scss';

const Gift = () => (
  <div className={style.giftPage}>
    <Header />
    <div className={style.contentContainer}>
      <div className={style.contentWrapper}>
        <Carousel />
        <div className={classnames(style.formSection, 'customScrollBar grey')}>
          <div className={style.formWrapper}>
            <div className="gift-up-target" data-site-id="532caea9-ee00-447d-afab-114c9c57c7a9" data-platform="Other" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Gift;
