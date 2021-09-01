import { h } from 'preact';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { connect } from 'react-redux';
import Carousel from 'react-multi-carousel';
import { format } from 'date-fns';
import { isEmpty } from 'lodash-es';
import classnames from 'classnames';

import Card from '../Card';
import PreviewVideo from '../Card/PreviewVideo';
import { useUpcomingTalks } from '../../routes/habitat/hooks';

import 'react-multi-carousel/lib/styles.css';
import style from './style.scss';

const ScheduleCarousel = ({
  habitatId,
  previewVideo,
}) => {
  const ref = useRef();
  const [initiallyLoaded, setInitiallyLoaded] = useState(false);
  const { loading, error, upcoming = [] } = useUpcomingTalks(habitatId, 1);
  const list = useMemo(() => {
    const items = [];

    if (!isEmpty(previewVideo)) {
      items.push(<PreviewVideo videoUrl={previewVideo} />)
    }
    return items;
  }, [previewVideo]);
  const liveTalks = useMemo(
    () => upcoming.map(({ startTime, isStreamLive, ...rest }) => ({
      text: `TALK | ${format(startTime, 'EEE hh:mm aa').toUpperCase()}`,
      startTime,
      ...rest,
    })),
    [upcoming],
  );

  useEffect(() => {
    if (!loading) {
      setInitiallyLoaded(true);
    }
  }, [loading]);

  return (
    <div className={style.container}>
      {!initiallyLoaded && <Card loading />}
      {/* TODO: add error UI */}

      {initiallyLoaded && !error && (
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
          className={classnames(style.carousel, {
            [style.singleItem]: (liveTalks.length + list.length) === 1,
          }) }
          responsive={{
            generic: {
              breakpoint: { max: 3000, min: 0 },
              items: 1,
              partialVisibilityGutter: 20,
            },
          }}
        >
          {list}

          {liveTalks.map(({
            _id,
            title,
            startTime,
            zoo,
            text,
            profileImage,
            description,
            habitatId,
          }) => (
            <Card
              key={_id}
              scheduleId={_id}
              title={title}
              zoo={zoo}
              startTime={startTime}
              header={text}
              description={description}
              image={profileImage}
              habitatId={habitatId}
            />
          ))}
        </Carousel>
      )}
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
