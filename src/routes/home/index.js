import { h } from 'preact';
import { route } from 'preact-router';

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

import style from './style.scss';

const Home = ({ partnerImage }) => (
  <div className={style.landing}>
    <Header />
    {/* This will need to float around the screen */}
    <FloatingButton onClick={() => route('/signup')} />
    <div className={style.container}>
      <div className={style.wrapper}>
        <HeroSection partnerImage={partnerImage} />
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
