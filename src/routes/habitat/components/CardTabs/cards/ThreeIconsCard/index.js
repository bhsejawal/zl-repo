import { h } from 'preact';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const Img = ({ src, text }) => (
  <div className={style.item}>
    <img src={src} alt="" />
    <p className={style.text}>{text}</p>
  </div>
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
    <div className={style.wrapper}>
      <h4 className={style.title}>{title}</h4>

      {text1 && img1 && (
        <Img src={img1} text={text1} />
      )}

      {text2 && img2 && (
        <Img src={img2} text={text2} />
      )}

      {text3 && img3 && (
        <Img src={img3} text={text3} />
      )}
    </div>
  </CardWrapper>
);

export default ThreeIconsCard;
