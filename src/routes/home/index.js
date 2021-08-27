import { h } from 'preact';
import { FloatingButton } from 'Components/Buttons';
import { Experiment, Variant } from 'react-optimize';

import Header from './Header';
import HeroSection from './HeroSection';
import Partners from './Partners';
import Conservation from './Conservation';
import Features from './Features';
import Overview from './Overview';
import FAQ from './FAQ';
import Testimonials from './Testimonials';
import Footer from './Footer';
import TorontoHeroSection from './TorontoHeroSection';
import TorontoPartnersSection from './TorontoPartnersSection';

import { goToSignup } from './helpers';

import style from './style.scss';

const Home = ({ partnerImage, partner }) => (
  <div className={style.landing}>
    <Header />
    {/* This will need to float around the screen */}
    <FloatingButton onClick={goToSignup} />
    <div className={style.container}>
      <div className={style.wrapper}>
        {partner === 'torontozoo' && (
          <Experiment id="M0zsRcGaRAOUi4XQdlrG_A">
            <Variant id="0">
              <HeroSection partnerImage={partnerImage} partner={partner} />
              <Partners />
            </Variant>
            <Variant id="1">
              <TorontoHeroSection />
              <TorontoPartnersSection />
            </Variant>
          </Experiment>
        )}
        {partner !== 'torontozoo' && (
          <>
            <HeroSection partnerImage={partnerImage} partner={partner} />
            <Partners />
          </>
        )}
        <Overview />
        <Features />
        <Conservation />
        <Testimonials />
        <FAQ />
        <Footer />
      </div>
    </div>
  </div>
);

export default Home;
