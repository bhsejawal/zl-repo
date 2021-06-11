import { h } from 'preact';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { connect } from 'react-redux';
import Carousel from 'react-multi-carousel';
import { formatDistanceToNow } from 'date-fns';
import classnames from 'classnames';

import BroadcastWrapper from 'Components/BroadcastWrapper';
import { hasPermission } from 'Components/Authorize';
import Tag from '../Tag';
import Card from '../Card';
import LiveTalk from '../Card/LiveTalk';
import { useUpcomingTalks } from '../../routes/habitat/hooks';

import 'react-multi-carousel/lib/styles.css';
import style from './style.scss';

const ScheduleCarousel = ({
  habitatId,
  hostStreamKey,
  isHostStreamOn,
  isBroadcasting,
}) => {
  const ref = useRef();
  const [now, setNow] = useState(new Date());
  const [initiallyLoaded, setInitiallyLoaded] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { loading, error, upcoming = [] } = useUpcomingTalks(habitatId);
  const list = useMemo(
    () => upcoming.map(({ startTime, isStreamLive, ...rest }) => ({
      // TODO: we should format it to a shorter value ('days' -> 'd', 'minutes' -> 'm)
      text: startTime > now && `starts in ${formatDistanceToNow(startTime)}`,
      isLive: startTime <= now && isStreamLive,
      startTime,
      ...rest,
    })),
    [upcoming, now],
  );

  useEffect(() => {
    if (!loading) {
      setInitiallyLoaded(true);
    }
  }, [loading]);

  useEffect(() => {
    if (ref.current) {
      ref.current.goToSlide(0);
    }
  }, [isHostStreamOn]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
          className={classnames(style.carousel, { [style.singleItem]: list.length === 0 }) }
          responsive={{
            generic: {
              breakpoint: { max: 3000, min: 0 },
              items: 1,
              partialVisibilityGutter: 20,
            },
          }}
        >
          {hasPermission('habitat:broadcast') && (!isHostStreamOn || isBroadcasting) && <BroadcastWrapper />}
          {hostStreamKey && isHostStreamOn && !isBroadcasting
            && <LiveTalk streamId={hostStreamKey} />}

          {list.map(({
            _id,
            title,
            startTime,
            zoo,
            isLive,
            text,
            profileImage,
            description,
          }) => (
            <Card
              key={_id}
              scheduleId={_id}
              title={title}
              zoo={zoo}
              startTime={startTime}
              live={isLive}
              header={isLive ? <Tag label="LIVE" varient="online" /> : text}
              description={description}
              image={profileImage}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default connect((
  {
    habitat: { habitatInfo: { _id: habitatId, hostStreamKey, isHostStreamOn } },
    mainStream: { interactionState: { isBroadcasting } },
  },
) => (
  {
    habitatId,
    hostStreamKey,
    isHostStreamOn,
    isBroadcasting,
  }
))(ScheduleCarousel);
