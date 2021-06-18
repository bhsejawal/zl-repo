import { h } from 'preact';
import { Text } from 'grommet';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';
import Video from '../components/Video';

import style from './style.scss';

const TwoVideosCard = ({
  tag,
  video1Url,
  text1,
  video2Url,
  text2,
  className,
  onPlay,
  onStop,
  mobile,
}) => (
  <CardWrapper className={classnames(className, { [style.mobile]: mobile })} tag={tag} padding="20px 10px 10px">
    <div className={style.wrapper}>
      <Video url={video1Url} onPlay={onPlay} onStop={onStop} />
      <Text as="p" size="medium">{text1}</Text>

      <Video url={video2Url} onPlay={onPlay} onStop={onStop} />
      <Text as="p" size="medium">{text2}</Text>
    </div>
  </CardWrapper>
);

export default TwoVideosCard;
