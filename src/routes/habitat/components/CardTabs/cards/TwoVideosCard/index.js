import { h } from 'preact';
import { Text } from 'grommet';

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
  <CardWrapper tag={tag} padding="20px 10px 10px">
    <div className={style.wrapper}>
      <Video url={video1Url} />
      <Text as="p" size="medium">{text1}</Text>

      <Video url={video2Url} />
      <Text as="p" size="medium">{text2}</Text>
    </div>
  </CardWrapper>
);

export default TwoVideosCard;
