import { h } from 'preact';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const SingleIconCard = ({
  tag,
  img,
  title,
  text,
}) => (
  <CardWrapper tag={tag}>
    <div className={style.wrapper}>
      <div className={style.top}>
        <img className={style.img} src={img} alt="" />
      </div>
      <div className={style.bottom}>
        <h4 className={style.title}>{title}</h4>
        <p className={style.text}>{text}</p>
      </div>
    </div>
  </CardWrapper>
);

export default SingleIconCard;
