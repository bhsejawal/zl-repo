import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import {
  Layer,
  Box,
  Grommet,
  Heading,
} from 'grommet';
import Carousel from 'react-multi-carousel';
import { PrimaryButton } from 'Components/Buttons';
import grommetTheme from '../../../../../grommetTheme';

import style from './style.scss';

const MobileOnboarding = ({ updateOnboarding, error }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const ref = useRef();

  const handler = () => {
    if (slideIndex !== 1) {
      ref.current.goToSlide(1);
    } else {
      updateOnboarding();
    }
  };

  const buttonText = slideIndex !== 1 ? 'Next' : 'Let’s go!';

  return (
    <Grommet
      theme={{
        ...grommetTheme,
        layer: {
          container: {
            extend: {
              maxWidth: '100vw',
              maxHeight: 'calc(100 * var(--vh))',
            },
          },
        },
      }}>
      <Layer>
        <Box className={style.onboarding}>
          <Box className={style.top}>
            <button type="button" className={style.skip} onClick={() => updateOnboarding(true)}>Skip</button>
          </Box>
          <Box className={style.middle}>
            <Box className={style.contentWrapper}>
              <Carousel
                ref={ref}
                afterChange={(nextSlide, { currentSlide}) => setSlideIndex(currentSlide)}
                dotListClass={style.dots}
                slidesToSlide={1}
                swipeable
                arrows={false}
                autoPlaySpeed={3000}
                draggable
                minimumTouchDrag={80}
                partialVisible
                renderDotsOutside
                showDots
                keyBoardControl={false}
                className={style.carousel}
                responsive={{
                  generic: {
                    breakpoint: { max: 3000, min: 0 },
                    items: 1,
                  },
                }}
              >
                <div className={style.content}>
                  <img src="https://assets.zoolife.tv/onboardingSlide1.png" alt="1" />
                  <span className={style.step}>ZOOLIFE TIP 1/2</span>
                  <Heading level="2" margin="8px 0 40px 0">
                    <span className={style.blue}>Tap&nbsp;</span>
                    the stream to move the camera!
                  </Heading>
                </div>

                <div className={style.content}>
                  <img src="https://assets.zoolife.tv/onboardingSlide2.png" alt="2" />
                  <span className={style.step}>ZOOLIFE TIP 2/2</span>
                  <Heading level="2" margin="8px 0 40px 0">
                    Tune into live
                    <span className={style.blue}>&nbsp;Expert Talks&nbsp;</span>
                    daily!
                  </Heading>
                </div>
              </Carousel>
            </Box>
          </Box>
          <Box className={style.bottom}>
            <PrimaryButton
              onClick={handler}
              primary
              label={error ? 'Try Again!' : buttonText}
              size="large"
              loading={false}
            />
          </Box>
        </Box>
      </Layer>
    </Grommet>
  );
};

export default MobileOnboarding;
