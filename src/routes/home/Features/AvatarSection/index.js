import { route } from 'preact-router';
import { LandingSecondary } from 'Components/Buttons';

import style from "../style.scss";

const AvatarSection = () => (
  <div className={style.top}>
    <div className={style.left}>
      <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_animal_grid.png" alt="animals" />
    </div>
    <div className={style.right}>
      <div className={style.description}>
        <h2>Meet dozens of your favorite animals, from home.</h2>
        <p>
          Explore the secret life of remarkable animals from around the globe.
        </p>
        <LandingSecondary onClick={() => route('/signup')}>Meet the Animals</LandingSecondary>
      </div>
    </div>
  </div>
);

export default AvatarSection;
