import { h } from 'preact';

import { Box, Text, Heading } from 'grommet';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const Img = ({ src, text }) => (
  <Box direction="row" fill className={style.item} align="center">
    <img src={src} alt="" />
    <Text size="medium">{text}</Text>
  </Box>
);

const ThreeIconsCard = ({
  tag,
  title,
  img1,
  img2,
  img3,
  text1,
  text2,
  text3,
}) => (
  <CardWrapper tag={tag}>
    <Box fill align="center" margin={{ top: '15px' }}>
      <Heading level="4" alignSelf="start" margin={{ bottom: '25px', top: '0px'}}>{title}</Heading>

      {text1 && img1 && (
        <Img src={img1} text={text1} />
      )}

      {text2 && img2 && (
        <Img src={img2} text={text2} />
      )}

      {text3 && img3 && (
        <Img src={img3} text={text3} />
      )}
    </Box>
  </CardWrapper>
);

export default ThreeIconsCard;
