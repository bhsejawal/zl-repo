import { Heading } from 'grommet';

import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Carousel from 'react-multi-carousel';

import 'react-multi-carousel/lib/styles.css';
import style from './style.scss';

const Overview = () => (
  <div className={style.overview}>
    <div className={style.topSection}>
      <div className={style.video}>
        <video
          muted
          controls={false}
          autoPlay
          loop
          playsInline
        >
          <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_video.webm" type="video/webm" />
          <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={style.description}>
        <div className={style.streamingLive}>
          <FontAwesomeIcon icon={faCircle} />
          <span>Streaming Live</span>
        </div>
        <Heading level="2" margin="0">Immersive animal experiences designed to bring you closer to nature.</Heading>
        <ul>
          <li>Meet 9 remarkable animal families</li>
          <li>Observe up-close with live audience-guided cameras. </li>
          <li>Join daily keeper talks and interactive Q&As with experts.</li>
        </ul>
        <div className={style.greenLeaves}>
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_green_leaf.png" alt="" />
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_green_leaf.png" alt="" />
        </div>
      </div>
    </div>
    <div className={style.bottomSection}>
      <Carousel
        slidesToSlide={1}
        swipeable
        dotListClass={style.dots}
        additionalTransfrom={0}
        arrows={true}
        autoPlaySpeed={3000}
        draggable
        minimumTouchDrag={80}
        partialVisible
        renderDotsOutside
        showDots={true}
        centerMode={false}
        className=""
        containerClass="container"
        focusOnSelect={false}
        keyBoardControl
        renderButtonGroupOutside={false}
        responsive={{
          three: {
            breakpoint: { max: 4000, min: 1024 },
            items: 3,
          },
          two: {
            breakpoint: { max: 1023, min: 740 },
            items: 2,
            partialVisibilityGutter: 50,
          },
          one: {
            breakpoint: { max: 739, min: 430 },
            items: 1,
            partialVisibilityGutter: 100,
          },
          oneSmall: {
            breakpoint: { max: 429, min: 320 },
            items: 1,
            partialVisibilityGutter: 10,
          },
        }}
      >
        <div className={style.item}>
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_img1.png" alt="" />
          <p>Discover what animals do when no one&apos;s watching.</p>
        </div>
        <div className={style.item}>
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_img2.png" alt="" />
          <p>Reset with healthy screen time for you & loved ones.</p>
        </div>
        <div className={style.item}>
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s3_img3.png" alt="" />
          <p>Join the conservation movement.</p>
        </div>
      </Carousel>
    </div>
  </div>
);

export default Overview;
