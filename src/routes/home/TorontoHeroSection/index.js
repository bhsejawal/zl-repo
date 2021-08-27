import { h } from 'preact';
import { LandingPrimary } from 'Components/Buttons';

import { useState, useEffect, useRef } from 'preact/hooks';

import { goToSignup } from '../helpers';
import { useWindowResize } from '../../../hooks';
import conservationIcon from './conservationIcon.png';

import desktopPlaceholder from './deskopPlacholder.jpeg';
import mobilePlaceholder from './mobilePlaceholder.jpeg';

import style from './style.scss';

const HeroSection = () => {
  const [mediaUrls, setMediaUrls] = useState();
  const [videoVisible, setVideoVisible] = useState();
  const { width } = useWindowResize();
  const videoRef = useRef();

  useEffect(() => {
    if (width <= 768) {
      setMediaUrls([mobilePlaceholder, 'https://assets.zoolife.tv/landing/s1_features_mobile_torontozoo.mp4']);
    } else {
      setMediaUrls([desktopPlaceholder, 'https://assets.zoolife.tv/landing/s1_features_torontozoo.mp4']);
    }
  }, [width]);

  const onVideoDataLoaded = () => {
    setVideoVisible(true);
  }

  if (!mediaUrls) {
    return null;
  }

  return (
    <div className={style.heroContainer}>
      <div className={style.top}>
        <div className={style.left}>
          <div>
            <div>
              <h1>
                {`Go behind the scenes with your favourite animals at `}
                <span className={style.underline}>Toronto Zoo.</span>
              </h1>
              <p className="body" style={{ padding: '0 20px' }}>
                Join nature experts as you observe unfiltered moments and behaviours in HD.
              </p>
              <LandingPrimary onClick={goToSignup}>Meet the Animals</LandingPrimary>
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.videoContainer}>
            <div className={style.videoWrapper}>
              <div className={style.videoContent}>
                <img className={style.videoPlaceholder} src={mediaUrls[0]} alt="" />
                <video
                  key={mediaUrls[1]}
                  muted
                  autoPlay
                  loop
                  playsInline
                  ref={videoRef}
                  controls={false}
                  onLoadedData={onVideoDataLoaded}
                  style={{ visibility: videoVisible ? "visible" : "hidden" }}
                >
                  <source src={mediaUrls[1]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.bottom}>
        <img src={conservationIcon} alt="Conservation Icon" />
        <h4>
          80% of every Zoolife pass funds animal care & conservation efforts led by Toronto Zoo.
        </h4>
      </div>
    </div>
  );
};

export default HeroSection;
