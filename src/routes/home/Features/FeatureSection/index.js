import { route } from 'preact-router';
import { LandingSecondary } from 'Components/Buttons';

import style from '../style.scss';

const FeatureSection = () => (
  <div className={style.middle}>
    {/* this section is reversed on desktop */}
    <div className={style.left}>
      <div className={style.videoWrapper}>
        <img
          src="https://assets.zoolife.tv/landing/s4_macbook.png"
          alt="laptop mockup"
        />
        <video muted autoPlay loop playsInline controls={false}>
          <source src="https://assets.zoolife.tv/landing/s4_camera.webm" type="video/webm" />
          <source src="https://assets.zoolife.tv/landing/s4_camera.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
    <div className={style.right}>
      <div className={style.description}>
        <h2>Get closer than you&apos;ve ever been.</h2>
        <p>
          Use audience-guided cameras to observe animals and explore habitats stunningly close.
        </p>
        <LandingSecondary onClick={() => route('/signup')}>Explore a Habitat</LandingSecondary>
      </div>
    </div>
  </div>
);

export default FeatureSection;
