import { h } from 'preact';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';

import Tag from '../Tag';
import Card from './Card';

// Temporarily until loading from DB
import img1 from './img1.png';
import img2 from './img2.png';

import style from './style.scss';

const ScheduleCarousel = () => (
  <div className={style.container}>
    <Carousel
      dotListClass={style.dots}
      slidesToSlide={1}
      swipeable
      additionalTransfrom={0}
      arrows={false}
      autoPlaySpeed={3000}
      draggable
      minimumTouchDrag={80}
      partialVisible
      renderDotsOutside
      showDots
      responsive={{
        generic: {
          breakpoint: { max: 3000, min: 0 },
          items: 1,
          partialVisibilityGutter: 30,
        },
      }}
    >
      <Card
        live
        header={<Tag label="LIVE" />}
        description=" Making Breakfast with the Panda Nutritionist"
        image={img1}
        onClick={() => console.log('Remind Me')}
      />
      <Card
        header="STARTS IN 2 HOURS"
        description=" Making Breakfast with the Panda Nutritionist"
        image={img2}
        onClick={() => console.log('Remind Me')}
      />
      <Card
        loading
        header="STARTS IN 2 HOURS"
        description=" Making Breakfast with the Panda Nutritionist"
        image={img2}
        onClick={() => console.log('Remind Me')}
      />
      <Card loading />
    </Carousel>
  </div>
);

export default ScheduleCarousel;
