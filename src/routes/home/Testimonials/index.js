import { Heading, Text } from 'grommet';
import { LandingPrimary } from 'Components/Buttons';
import { route } from 'preact-router';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import quotation from './quotation.svg';
import style from './style.scss';

const Testimonial = ({ text, name, image }) => (
  <div className={style.testimonial}>
    <img className={style.quote} src={quotation} alt="" />
    <Text size="xlarge">{text}</Text>
    <div>
      <img src={image} alt="" />
      <span>{name}</span>
    </div>
  </div>
);

const Testimonials = () => (
  <div className={style.testimonials}>
    <Heading level="2" textAlign="center">What the community is saying.</Heading>

    <div className={style.carousel}>
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
        containerClass="container"
        focusOnSelect={false}
        keyBoardControl
        renderButtonGroupOutside={false}
        responsive={{
          four: {
            breakpoint: { max: 4000, min: 1080 },
            items: 4,
          },
          three: {
            breakpoint: { max: 1079, min: 966 },
            items: 3,
            partialVisibilityGutter: 50,
          },
          two: {
            breakpoint: { max: 965, min: 750 },
            items: 2,
            partialVisibilityGutter: 50,
          },
          one: {
            breakpoint: { max: 749, min: 600 },
            items: 1,
            partialVisibilityGutter: 250,
          },
          small: {
            breakpoint: { max: 599, min: 440 },
            items: 1,
            partialVisibilityGutter: 150,
          },
          xSmall: {
            breakpoint: { max: 439, min: 390 },
            items: 1,
            partialVisibilityGutter: 100,
          },
          xxSmall: {
            breakpoint: { max: 389, min: 320 },
            items: 1,
          },
        }}
      >
        <Testimonial
          text="You feel like you're right there with an animal family without leaving your couch."
          image="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s6_testimonial_1.png"
          name="Corrine, Denver"
        />
        <Testimonial
          text="The healthiest screen time I've had in months, so therapeutic."
          image="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s6_testimonial_2.png"
          name="Billie, Auckland"
        />
        <Testimonial
          text="An incredible way to experience & protect nature as a family."
          image="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s6_testimonial_3.png"
          name="JP, Sao Paulo"
        />
        <Testimonial
          text="... and I've never felt more connected with nature than I do on Zoolife."
          image="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s6_testimonial_4.png"
          name="Arjun, Montreal"
        />
      </Carousel>
    </div>

    <div className={style.mission}>
      <div>
        <Heading level="6" margin="0">CROWDFUNDING CONSERVATION</Heading>
        <Heading level="1" margin="0">At Zoolife, our mission is to help humankind reconnect with nature, while working together to protect it.</Heading>
        <Text size="xlarge" >50% of your purchase directly funds animal care & conservation efforts led by our partners.</Text>

        <LandingPrimary type="button" onClick={() => route('/signup')}>Join The Community</LandingPrimary>
      </div>
      <img
        loading="lazy"
        className={style.mountain}
        src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s6_mountin.png"
        alt=""
      />
    </div>
  </div>
);

export default Testimonials;
