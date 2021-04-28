import { h } from 'preact';
import { route } from 'preact-router';
import { LandingSecondary } from 'Components/Buttons';
import { useState, useEffect } from 'preact/hooks';

import zoolifeLogoWhite from './zoolife-white.png';

import style from './style.scss';

const rotatingText = ['Explore', 'Protect', 'Observe', 'Discover', 'Support'];

const HeroSection = ({ partnerImage }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setIndex(index === rotatingText.length - 1 ? 0 : index + 1 );
      },
      2500,
    );

    return () => clearTimeout(timeout);
  }, [index]);

  return (
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

              <h1>
                <div className={style.animationContainer}>
                  <span className={style.animatedText}>
                    {rotatingText[index]}
                  </span>
                  &nbsp;
                </div>
                nature from home.
              </h1>
              <h4>
                Live animal experiences from the world&apos;s top zoos, hosted by nature experts.
              </h4>
              <LandingSecondary onClick={() => route('/signup')}>Meet the Animals</LandingSecondary>
            </div>
          </div>
        </div>
        <div className={style.right}>
          <video muted autoPlay loop playsInline controls={false}>
            <source src="https://assets.zoolife.tv/landing/s1.webm" type="video/webm" />
            <source src="https://assets.zoolife.tv/landing/s1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className={style.bottom}>
        <h4>50% of your purchase funds animal care &amp; conservation.</h4>
      </div>
    </div>
  );
};

export default HeroSection;
