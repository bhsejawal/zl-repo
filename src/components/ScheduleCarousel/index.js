import { h } from 'preact';
import {
  useMemo,
  useRef,
} from "preact/hooks";
import { connect } from 'react-redux';
import Carousel from 'react-multi-carousel';
import { isEmpty } from 'lodash-es';
import classnames from 'classnames';

import PreviewVideo from '../Card/PreviewVideo';

import 'react-multi-carousel/lib/styles.css';
import style from './style.scss';
// TODO Check if this will be reused
const ScheduleCarousel = ({
  previewVideo,
}) => {
  const ref = useRef();
  const list = useMemo(() => {
    const items = [];

    if (!isEmpty(previewVideo)) {
      items.push(<PreviewVideo videoUrl={previewVideo} />)
    }
    return items;
  }, [previewVideo]);

  if (!list.length) {
    return null;
  }

  return (
    <div className={style.container}>
      <Carousel
        ref={ref}
        dotListClass={style.dots}
        slidesToSlide={1}
        swipeable
        additionalTransfrom={-30}
        arrows={false}
        autoPlaySpeed={3000}
        draggable
        minimumTouchDrag={80}
        partialVisible
        renderDotsOutside
        showDots
        keyBoardControl={false}
        className={classnames(style.carousel, style.singleItem)}
        responsive={{
          generic: {
            breakpoint: { max: 3000, min: 0 },
            items: 1,
            partialVisibilityGutter: 20,
          },
        }}
      >
        {list}
      </Carousel>
    </div>
  );
};

export default connect((
  {
    habitat: {
      habitatInfo: {
        _id: habitatId,
        previewVideo,
      },
    },
  },
) => (
  {
    habitatId,
    previewVideo,
  }
))(ScheduleCarousel);
