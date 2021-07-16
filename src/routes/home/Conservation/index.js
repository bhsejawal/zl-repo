import { LandingPrimary } from 'Components/Buttons';

import { goToSignup } from '../helpers';

import style from './style.scss';

const Conversation = () => (
  <div className={style.conversation}>
    <div className={style.left}>
      <div className={style.wrapper}>
        <h2>
          Support the conservation movement with your purchase.
        </h2>
        <p className="body">
          {/* eslint-disable-next-line max-len */}
          50% of your purchase directly funds animal care &amp; conservation efforts led by our partners.
        </p>
        <LandingPrimary onClick={goToSignup}>Try Zoolife Free</LandingPrimary>
      </div>
    </div>
    <div className={style.right}>
      <img loading="lazy" src="https://assets.zoolife.tv/landing/s5_koalas.jpg" alt="koalas" />
    </div>
  </div>
);

export default Conversation;
