import { h } from 'preact';
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "preact/hooks";
import { connect } from 'react-redux';
import Carousel from 'react-multi-carousel';
import { formatDistanceToNow } from 'date-fns';

import { GlobalsContext } from 'Shared/context';
import Broadcast from 'Components/Broadcast';

import Tag from '../Tag';
import Card from '../Card';
import LiveTalk from '../Card/LiveTalk';
import { useUpcomingTalks } from '../../routes/habitat/hooks';

import 'react-multi-carousel/lib/styles.css';
import style from './style.scss';

const now = new Date();

const ScheduleCarousel = ({ habitatId, hostStreamKey, isHostStreamOn }) => {
  const { socket } = useContext(GlobalsContext);
  const ref = useRef();

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
    [upcoming],
  );

  const liveTalkEnable = () => {
    // change data on redux
    ref.current.goToSlide(0);
  }

  const liveTalkDisable = () => {
    // change data on redux
  }

  useEffect(() => {
    if (socket) {
      // these events do not exist on server yet
      socket.on('keeperTalkOn', liveTalkEnable);
      socket.on('keeperTalkOff', liveTalkDisable);
    }

    return () => {
      if (socket) {
        socket.off('keeperTalkOn', liveTalkEnable);
        socket.off('keeperTalkOff', liveTalkDisable);
      }
    }
  }, [socket]);

  return (
    <div className={style.container}>
      {loading && <Card loading />}
      {/* TODO: add error UI */}

      {!loading && !error && (
        <Carousel
          ref={ref}
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
          <Broadcast />
          {hostStreamKey && isHostStreamOn && <LiveTalk streamId={hostStreamKey} />}

          {list.map(({
            _id,
            animal,
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
              animal={animal}
              zoo={zoo}
              startTime={startTime}
              live={isLive}
              header={isLive ? <Tag label="LIVE" /> : text}
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
  { habitat: { habitatInfo: { _id: habitatId, hostStreamKey, isHostStreamOn } } },
) => (
  { habitatId, hostStreamKey, isHostStreamOn }
))(ScheduleCarousel);
