import ReactCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { useWindowResize } from '../../hooks';

import './style.scss';

const desktopList = [
  'https://zoolife.tv/assets/login-d1.jpg',
  'https://zoolife.tv/assets/login-d2.jpg',
  'https://zoolife.tv/assets/login-d3.jpg',
  'https://zoolife.tv/assets/login-d4.jpg',
];

const mobileList = [
  'https://zoolife.tv/assets/login-m1.jpg',
  'https://zoolife.tv/assets/login-m2.jpg',
  'https://zoolife.tv/assets/login-m3.jpg',
  'https://zoolife.tv/assets/login-m4.jpg',
];

const Carousel = () => {
  const { width: windowWidth } = useWindowResize();
  const list = windowWidth > 768 ? desktopList : mobileList;

  return (
    <div className="carouselContainer">
      <div className="carouselWrapper">
        <div className="carouselAbsoluteContainer">
          <ReactCarousel
            dotListClass="dots"
            slidesToSlide={1}
            swipeable
            arrows={false}
            autoPlay
            autoPlaySpeed={4000}
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
                breakpoint: { max: 4096, min: 0 },
                items: 1,
                slidesToSlide: 1,
              },
            }}
          >
            {list.map((image) => (<img key={image} src={image} alt="" />))}
          </ReactCarousel>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
