import { route } from 'preact-router';
import { LandingPrimary } from 'Components/Buttons';

import style from './style.scss';

const Conversation = () => (
  <div className={style.conversation}>
    <div className={style.left}>
      <div className={style.wrapper}>
        <h2>
          Support the conservation movement with your purchase.
        </h2>
        <p className="body">
          50% of your purchase directly funds animal care & conservation
          efforts led by our partners.
        </p>
        <LandingPrimary onClick={() => route('/signup')}>I want to help</LandingPrimary>
      </div>
    </div>
    <div className={style.right}>
      <img loading="lazy" src="https://assets.zoolife.tv/landing/s5_koalas.jpg" alt="koalas" />
    </div>
  </div>
);

export default Conversation;
