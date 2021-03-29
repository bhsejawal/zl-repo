import { h } from 'preact';
import { route } from 'preact-router';
import { Grommet, Main, Box } from 'grommet';
import { merge } from 'lodash-es';

import { FloatingButton } from 'Components/Buttons';

import Header from './Header';
import HeroSection from './HeroSection';
import Partners from './Partners';
import Conservation from './Conservation';
import Features from './Features';

import grommetTheme from '../../grommetTheme';
// TODO: move this to its own file and import it;
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
  button: merge(grommetTheme.button, {
    secondary: {
      color: 'var(--white)',
      background: {
        color: 'var(--hunterGreen)',
      },
      font: {
        weight: 'bold',
      },
    },
    hover: {
      secondary: {
        color: 'white',
        background: {
          color: 'var(--hunterGreenMediumLight)',
        },
      },
    },
    extend: {
      '&:active': {
        opacity: '0.8',
      },
      width: 'fit-content',
      minWidth: '228px',
      fontSize: '20px',
    },
  }),
};

const Home = () => (
  <Grommet theme={websiteTheme}>
    <Main width={{ max: "1650px", min: "350px" }} margin={{ horizontal: 'auto' }}>
      <Header />
      <Box fill pad={{top: 'var(--headerHeight)'}}>
        <HeroSection />
        <Partners />
        <Conservation />
        <Features />
      </Box>
      {/* This will need to float around the screen */}
      <FloatingButton
        onClick={() => route('/signup')}
        style={{ position: 'fixed', bottom: '20px', right: '20px'}}
      />
    </Main>
  </Grommet>
);

export default Home;
