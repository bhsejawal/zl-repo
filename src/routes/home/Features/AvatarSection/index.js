import { LandingSecondary } from 'Components/Buttons';

import { goToSignup } from '../../helpers';

import style from "../style.scss";

const AvatarSection = () => (
  <div className={style.top}>
    <div className={style.left}>
      <img
        src="https://assets.zoolife.tv/landing/s4_animal_grid.png"
        alt="animals"
        loading="lazy"
      />
    </div>
    <div className={style.right}>
      <div className={style.description}>
        <h2>Meet dozens of your favorite animals, from home.</h2>
        <p>
          Explore the secret life of remarkable animals from around the globe.
        </p>
        <LandingSecondary onClick={goToSignup}>Meet the Animals</LandingSecondary>
      </div>
    </div>
  </div>
);

export default AvatarSection;
