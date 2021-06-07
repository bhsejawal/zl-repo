import { h } from 'preact';
import { LandingSecondary } from 'Components/Buttons';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Experiment, Variant } from 'react-optimize';

import { goToSignup } from '../helpers';
import zoolifeLogoWhite from './zoolife-white.png';
import videoPlaceholderA from './video-placeholder.jpg';
import videoPlaceholderB from './video-placeholderb.jpg';

import style from './style.scss';

const rotatingText = ['Explore', 'Protect', 'Observe', 'Discover', 'Support'];

const VideoSectionA = () => {
  const [videoUrls, setVideoUrls] = useState();
  const [videoVisible, setVideoVisible] = useState();
  const videoRef = useRef();

  useEffect(() => {
    setVideoUrls(document.body.clientWidth > 1200 ? [
      'https://assets.zoolife.tv/landing/bigg4.webm',
      'https://assets.zoolife.tv/landing/bigg4.mp4',
    ] : [
      'https://assets.zoolife.tv/landing/s1.webm',
      'https://assets.zoolife.tv/landing/s1.mp4',
    ]);
  }, []);

  const onVideoDataLoaded = () => {
    setVideoVisible(true);
  }

  if (!videoUrls) {
    return null;
  }

  return (
    <>
      <img className={style.videoPlaceholder} src={videoPlaceholderA} alt="" />
      <video
        muted
        autoPlay
        loop
        playsInline
        ref={videoRef}
        controls={false}
        onLoadedData={onVideoDataLoaded}
        style={{ visibility: videoVisible ? "visible" : "hidden" }}
      >
        <source src={videoUrls[0]} type="video/webm" />
        <source src={videoUrls[1]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}

const VideoSectionB = () => {
  const [videoVisible, setVideoVisible] = useState();
  const videoRef = useRef();

  const onVideoDataLoaded = () => {
    setVideoVisible(true);
  }

  return (
    <>
      <img className={style.videoPlaceholder} src={videoPlaceholderB} alt="" />
      <video
        muted
        autoPlay
        loop
        playsInline
        ref={videoRef}
        controls={false}
        onLoadedData={onVideoDataLoaded}
        style={{ visibility: videoVisible ? "visible" : "hidden" }}
      >
        <source src="https://zoolife.tv/assets/hero-desktop.mp4" type="video/webm" />
        <source src="https://zoolife.tv/assets/NewHeader.webm" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}

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
                  <img alt="partner-logo" src={partnerImage} className={style.partnerLogo} />
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
              <LandingSecondary onClick={goToSignup}>Meet the Animals</LandingSecondary>
            </div>
          </div>
        </div>
        <div className={style.right}>
          <Experiment id="VApN2F3gSXemhsEH6HjCBQ">
            <Variant id="0">
              <VideoSectionA />
            </Variant>
            <Variant id="1">
              <VideoSectionB />
            </Variant>
          </Experiment>
        </div>
      </div>
      <div className={style.bottom}>
        <h4>50% of your purchase funds animal care &amp; conservation.</h4>
      </div>
    </div>
  );
};

export default HeroSection;
