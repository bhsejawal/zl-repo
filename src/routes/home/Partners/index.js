import { h } from 'preact';

import { goToSignup } from '../helpers';

import style from './style.scss'

const Partners = () => (
  <div className={style.partnersContainer}>
    <div>
      <h2>
        Live 24/7 from accredited zoos, animal sanctuaries and rehabilitation centers worldwide.
      </h2>
    </div>

    <div className={style.partners}>
      <div>
        <div onClick={goToSignup} className={style.clickable}>
          <img src="https://assets.zoolife.tv/landing/s2_pmmc.png" alt="" />
        </div>
        <div onClick={goToSignup} className={style.clickable}>
          <img src="https://assets.zoolife.tv/landing/s2_toronto_zoo.png" alt="" />
        </div>
      </div>
      <div>
        <div onClick={goToSignup} className={style.clickable}>
          <img src="https://assets.zoolife.tv/landing/s2_orana.png" alt="" />
        </div>
        <div onClick={goToSignup} className={style.clickable}>
          <img src="https://assets.zoolife.tv/landing/s2_san_antonio.png" alt="" />
        </div>
      </div>
    </div>
  </div>
);

export default Partners;
