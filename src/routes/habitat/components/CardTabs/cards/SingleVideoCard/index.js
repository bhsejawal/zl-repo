import { h } from 'preact';

import CardWrapper from '../components/CardWrapper';
import Video from '../components/Video';

import style from './style.scss';

const SingleVideoCard = ({
  tag,
  videoUrl,
  title,
  text,
}) => (
  <CardWrapper noPadding tag={tag}>
    <div className={style.wrapper}>
      <Video className={style.video} url={videoUrl} />

      <div className={style.bottom}>
        {title && <h4 className={style.title}>{title}</h4>}
        {text && <p className={style.text}>{text}</p>}
      </div>
    </div>
  </CardWrapper>
);

export default SingleVideoCard;
