import ReactCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import './style.scss';

const Carousel = () => (
  <div className="carouselContainer">
    <ReactCarousel
      dotListClass="dots"
      slidesToSlide={1}
      swipeable
      arrows={false}
      autoPlay
      autoPlaySpeed={3000}
      infinite
      draggable
      minimumTouchDrag={80}
      partialVisible
      renderDotsOutside
      showDots
      keyBoardControl={false}
      className="carousel"
      responsive={{
        mobile: {
          breakpoint: { max: 768, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
      }}
    >
      <div><img src="https://assets.zoolife.tv/signupCarousel-1.png" alt="image1" /></div>
      <div><img src="https://assets.zoolife.tv/signupCarousel-2.png" alt="image2" /></div>
      <div><img src="https://assets.zoolife.tv/signupCarousel-3.png" alt="image3" /></div>
      <div><img src="https://assets.zoolife.tv/signupCarousel-4.png" alt="image4" /></div>
    </ReactCarousel>
  </div>
);

export default Carousel;
