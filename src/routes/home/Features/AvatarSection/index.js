import { LandingSecondary } from 'Components/Buttons';

import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { goToSignup } from '../../helpers';

import style from "../style.scss";

const AvatarSection = () => (
  <div className={style.top} id="animalsSection">
    <div className={style.left}>
      <img
        src="https://assets.zoolife.tv/landing/s4_animal_grid_v2.png"
        alt="animals"
        loading="lazy"
      />
    </div>
    <div className={style.right}>
      <div className={style.description}>
        <div className={style.newAnimals}>
          <FontAwesomeIcon icon={faStar} color="black" />
          New animals added every month!
        </div>
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
