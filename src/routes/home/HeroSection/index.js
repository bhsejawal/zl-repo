import { h } from 'preact';
import { LandingPrimary } from 'Components/Buttons';
import { Experiment, Variant } from 'react-optimize';

import { useState, useEffect, useRef } from 'preact/hooks';

import { goToSignup } from '../helpers';
import { useWindowResize } from '../../../hooks';
import zoolifeLogoWhite from './zoolife-white.png';
import conservationIcon from './conservationIcon.png';

import desktopPlaceholder from './deskopPlacholder.jpeg';
import mobilePlaceholder from './mobilePlaceholder.jpeg';

import style from './style.scss';

const HeroSection = ({ partnerImage }) => {
  const [featuresMediaUrls, setfeaturesMediaUrls] = useState();
  const [mediaUrls, setMediaUrls] = useState();
  const [videoVisible, setVideoVisible] = useState();
  const { width } = useWindowResize();
  const videoRef = useRef();

  useEffect(() => {
    if (width <= 768) {
      setMediaUrls([mobilePlaceholder, 'https://assets.zoolife.tv/landing/s1_mobile.mp4']);
      setfeaturesMediaUrls([mobilePlaceholder, 'https://assets.zoolife.tv/landing/s1_features_mobile.mp4']);
    } else {
      setMediaUrls([desktopPlaceholder, 'https://assets.zoolife.tv/landing/s1_desktop.mp4']);
      setfeaturesMediaUrls([desktopPlaceholder, 'https://assets.zoolife.tv/landing/s1_features_desktop.mp4']);
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
              {partnerImage && (
                <div className={style.partner}>
                  <img alt="zoolife-logo" src={zoolifeLogoWhite} />
                  <span>x</span>
                  <img alt="partner-logo" src={partnerImage} className={style.partnerLogo} />
                </div>
              )}
              <Experiment id="OLguIG20RSuAWwX9_96_VA">
                <Variant id="0">
                  <h1>Immersive animal habitats ready to explore.</h1>
                  <p className="body">
                    Observe natural animal behaviors up-close in HD,
                    with talks led by nature experts.
                  </p>
                </Variant>
                <Variant id="1">
                  <h1>Live, unfiltered, uncut.</h1>
                  <p className="body">
                    Explore the daily lives of animals with nature experts & zoo staff.
                    Streaming from AZA zoos worldwide.
                  </p>
                </Variant>
              </Experiment>
              <LandingPrimary onClick={goToSignup}>Meet the Animals</LandingPrimary>
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.videoContainer}>
            <div className={style.videoWrapper}>
              <div className={style.videoContent}>
                <Experiment id="OLguIG20RSuAWwX9_96_VA">
                  <Variant id="0">
                    <img className={style.videoPlaceholder} src={featuresMediaUrls[0]} alt="" />
                    <video
                      key={featuresMediaUrls[1]}
                      muted
                      autoPlay
                      loop
                      playsInline
                      ref={videoRef}
                      controls={false}
                      onLoadedData={onVideoDataLoaded}
                      style={{ visibility: videoVisible ? "visible" : "hidden" }}
                    >
                      <source src={featuresMediaUrls[1]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Variant>
                  <Variant id="1">
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
                  </Variant>
                </Experiment>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.bottom}>
        <img src={conservationIcon} alt="Conservation Icon" />
        <h4>50% of your purchase funds animal care &amp; conservation.</h4>
      </div>
    </div>
  );
};

export default HeroSection;
