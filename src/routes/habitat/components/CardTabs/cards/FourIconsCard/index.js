import { h } from 'preact';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const Img = ({ src, text }) => (
  <div className={style.item}>
    <img src={src} alt="" />
    <p className={style.text}>{text}</p>
  </div>
);

const FourIconsCard = ({
  tag,
  title,
  text,
  img1,
  img2,
  img3,
  img4,
  icon1Txt,
  icon2Txt,
  icon3Txt,
  icon4Txt,
}) => (
  <CardWrapper tag={tag}>
    <div className={style.wrapper}>
      <div className={style.top}>
        {img1 && icon1Txt && (
          <Img src={img1} text={icon1Txt} />
        )}

        {img2 && icon2Txt && (
          <Img src={img2} text={icon2Txt} />
        )}

        {img3 && icon3Txt && (
          <Img src={img3} text={icon3Txt} />
        )}

        {img4 && icon4Txt && (
          <Img src={img4} text={icon4Txt} />
        )}
      </div>

      <div className={style.bottom}>
        <h4 className={style.title}>{title}</h4>
        <p className={style.text}>{text}</p>
      </div>
    </div>
  </CardWrapper>
);

export default FourIconsCard;
