import { h } from 'preact';
import { FloatingButton } from 'Components/Buttons';

import Header from './Header';
import HeroSection from './HeroSection';
import Partners from './Partners';
import Conservation from './Conservation';
import Features from './Features';
import Overview from './Overview';
import FAQ from './FAQ';
import Testimonials from './Testimonials';
import Footer from './Footer';
import LandingPageGift from './LandingPageGift';

import { goToSignup } from './helpers';

import style from './style.scss';

const Home = ({ partnerImage, partner }) => (
  <div className={style.landing}>
    <Header />
    {/* This will need to float around the screen */}
    <FloatingButton onClick={goToSignup} />
    <div className={style.container}>
      <div className={style.wrapper}>
        <HeroSection partnerImage={partnerImage} partner={partner} />
        <LandingPageGift />
        <Partners />
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
