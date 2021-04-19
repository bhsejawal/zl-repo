import { h } from 'preact';
import { route } from 'preact-router';
import { LandingSecondary } from 'Components/Buttons';

import zoolifeLogoWhite from 'Assets/zoolife-white.png';

import style from './style.scss';

const HeroSection = ({ partnerImage }) => (
  <div className={style.heroContainer}>
    <div className={style.top}>
      <div className={style.left}>
        <div>
          <div>
            {partnerImage && (
              <div className={style.partner}>
                <img alt="zoolife-logo" src={zoolifeLogoWhite} />
                <span>x</span>
                <img alt="partner-logo" src={partnerImage} />
              </div>
            )}

            <h1>Explore nature, from home.</h1>
            <h4>
              Live animal experiences from the world&apos;s top zoos, hosted by nature experts.
            </h4>
            <LandingSecondary onClick={() => route('/signup')}>Meet the Animals</LandingSecondary>
          </div>
        </div>
      </div>
      <div className={style.right}>
        <video autoPlay muted loop controls={false} >
          <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.webm" type="video/webm" />
          <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
    <div className={style.bottom}>
      <h4>50% of your purchase funds animal care &amp; conservation.</h4>
    </div>
  </div>
);

export default HeroSection;
