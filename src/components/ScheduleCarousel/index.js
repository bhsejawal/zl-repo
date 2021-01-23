import { h } from 'preact';
import 'react-multi-carousel/lib/styles.css';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";

import Carousel from 'react-multi-carousel';
import Tag from '../Tag';
import Card from './Card';
import LiveTalk from './Card/LiveTalk';
import { GlobalsContext } from '../../context';

// Temporarily until loading from DB
import img1 from './img1.png';
import img2 from './img2.png';

import style from './style.scss';

const STREAM_ID = '318257983413724778354144'; // temp

const ScheduleCarousel = () => {
  const { socket } = useContext(GlobalsContext);
  const [streamId, setStreamId] = useState(STREAM_ID);
  const ref = useRef();

  const liveTalkEnable = (id) => {
    setStreamId(id);
    ref.current.goToSlide(0);
  }

  const liveTalkDisable = () => {
    setStreamId();
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
        {/* until we fix issue with 2 videos on same screen, live talk will be disabled */}
        {streamId && <LiveTalk streamId={streamId} disabled />}
      </Carousel>
    </div>
  );
};

export default ScheduleCarousel;
