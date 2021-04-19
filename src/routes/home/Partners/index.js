import { h } from 'preact';

import style from './style.scss'

const Partners = () => (
  <div className={style.partnersContainer}>
    <div>
      <h2>
        Live 24/7 from accredited zoos and animal sanctuaries worldwide.
      </h2>
    </div>

    <div className={style.partners}>
      <div>
        <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_pacific.png" alt="" /></div>
        <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_toronto_zoo.png" alt="" /></div>
      </div>
      <div>
        <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_orana.png" alt="" /></div>
        <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_san_antonio.png" alt="" /></div>
      </div>
    </div>
  </div>
);

export default Partners;
