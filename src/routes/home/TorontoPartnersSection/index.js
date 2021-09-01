import { h } from 'preact';

import { goToSignup } from '../helpers';

import style from './style.scss'

const Partners = () => (
  <div className={style.partnersContainer}>
    <div className={style.partners}>
      <div className={style.carousel} onClick={goToSignup} />
    </div>
    <div className={style.textBlock}>
      <p className={style.tag}>
        New animals added every month.
      </p>
      <h2>
        Discover what animals do when no one’s watching.
      </h2>
      <p>
        Streaming live 24/7 from accredited zoos and sanctuaries worldwide.
      </p>
    </div>
  </div>
);

export default Partners;
