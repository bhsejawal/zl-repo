import { h } from 'preact';
import Header from 'Components/Header';
import { route } from 'preact-router';
import {
  Grommet,
  Heading,
  Main,
  Box,
} from 'grommet';
import { PrimaryButton, FloatingButton } from 'Components/Buttons';
import grommetTheme from '../../grommetTheme';

import style from './style.scss';

const websiteTheme = {
  ...grommetTheme,
  heading: {
    weight: '400',
    level: {
      1: {
        small: {
          size: '32px',
          height: '42px',
        },
        medium: {
          size: '40px',
          height: '55px',
          maxWidth: 'unset',
        },
      },
      2: {
        small: {
          size: '26px',
          height: '36px',
        },
        medium: {
          size: '30ppx',
          height: '40px',
          maxWidth: 'unset',
        },
      },
      3: {
        small: {
          size: '18px',
          height: '25px',
        },
        medium: {
          size: '20px',
          height: '30px',
          maxWidth: 'unset',
        },
      },
      4: {
        small: {
          size: '18px',
          height: '28px',
        },
        medium: {
          size: '20px',
          height: '30px',
          maxWidth: 'unset',
        },
      },
      5: {
        small: {
          size: '14px',
          height: '24px',
        },
        medium: {
          size: '16px',
          height: '26px',
          maxWidth: 'unset',
        },
      },
      6: {
        small: {
          size: '13px',
          height: '23px',
        },
        medium: {
          size: '15px',
          height: '25px',
          maxWidth: 'unset',
        },
      },
    },
  },
};

const Home = () => (
  <Grommet theme={websiteTheme}>
    <div className={style.home}>
      <Header />
      <Main fill pad={{top: 'var(--headerHeight)', bottom: '40px'}}>
        <Box className={style.twoSides} background={{color: '#9BB7F1'}}>
          <Box justify="center" alignContent="center" pad="30px" height={{min: '400px'}}>
            <Heading textAlign="center" level="1" margin="0">Explore nature, from home.</Heading>
            <Heading textAlign="center" level="4" margin="30px auto 60px">
              Incredible animal experiences from the world&apos;s
              top zoos, hosted by nature experts.
            </Heading>

            <PrimaryButton
              size="large"
              label="Meet the Animals"
              type="submit"
              onClick={() => route('/signup')}
            />
          </Box>
          <video autoPlay muted loop>
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.webm" type="video/webm" />
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.mov" type="video/mov" />
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <Box background="linear-gradient(180deg, #FFDCEE 0%, #FEDFD0 100%)">
          <Heading textAlign="center" level="4" margin="18px">50% of your purchase funds animal care & conservation.</Heading>
        </Box>

        <Box
          style={{position: 'relative'}}
          height={{min: '604px'}}
          justify="center"
          background={{image: 'url(https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_bg.png)'}}
        >
          {/* This button will to float across page on scroll */}
          <FloatingButton
            onClick={() => route('/signup')}
            style={{ position: 'absolute', top: '20px', right: '20px'}}
          />
          <Box alignSelf="center" width={{max: '700px'}}>
            <Heading textAlign="center" level="2" margin="18px">
              Live 24/7 from accredited zoos, animal sanctuaries and
              rehabilitation centers worldwide.
            </Heading>
          </Box>

          <div className={style.partners}>
            <div>
              <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_pacific.png" alt="" /></div>
              <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_toronto_zoo.png" alt="" /></div>
            </div>
            <div>
              <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_orana.png" alt="" /></div>
              <div><img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s2_coming_soon.png" alt="" /></div>
            </div>
          </div>
        </Box>
      </Main>
    </div>
  </Grommet>
);

export default Home;
