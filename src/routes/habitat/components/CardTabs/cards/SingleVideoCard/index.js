import { h } from 'preact';

import { Heading, Text } from 'grommet';

import CardWrapper from '../components/CardWrapper';
import Video from '../components/Video';

import style from './style.scss';

const SingleVideoCard = ({
  tag,
  videoUrl,
  title,
  text,
  className,
  onPlay,
  onStop,
}) => (
  <CardWrapper noPadding className={className} tag={tag}>
    <div className={style.wrapper}>
      <Video className={style.video} url={videoUrl} onPlay={onPlay} onStop={onStop} />

      <div className={style.bottom}>
        {title && <Heading level="4" color="white" textAlign="center" margin={{ bottom: '10px' }}>{title}</Heading>}
        {text && <Text size="medium" color="white" textAlign="center">{text}</Text>}
      </div>
    </div>
  </CardWrapper>
);

export default SingleVideoCard;
