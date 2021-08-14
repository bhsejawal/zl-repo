import { h } from 'preact';

import { goToSignup } from '../helpers';

import style from './style.scss'

const Partners = () => (
  <div className={style.partnersContainer}>
    <div>
      <h2>
        Find out what animals do when no one&apos;s watching.
      </h2>
      <p>
        Streaming live 24/7 from accredited zoos and sanctuaries worldwide.
      </p>
    </div>

    <div className={style.partners}>
      <div className={style.carousel} onClick={goToSignup} />
    </div>
  </div>
);

export default Partners;
