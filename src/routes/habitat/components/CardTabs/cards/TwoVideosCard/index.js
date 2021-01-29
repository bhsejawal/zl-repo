import { h } from 'preact';

import CardWrapper from '../components/CardWrapper';
import Video from '../components/Video';

import style from './style.scss';

const TwoVideosCard = ({
  tag,
  video1Url,
  text1,
  video2Url,
  text2,
}) => (
  <CardWrapper tag={tag}>
    <div className={style.wrapper}>
      <Video url={video1Url} />
      <p className={style.text}>{text1}</p>

      <Video url={video2Url} />
      <p className={style.text}>{text2}</p>
    </div>
  </CardWrapper>
);

export default TwoVideosCard;
