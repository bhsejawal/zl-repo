import { h } from 'preact';
import { formatDistanceToNow, parseISO } from 'date-fns';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const AnimalProfileCard = ({
  tag,
  img,
  name,
  title,
  sex,
  dateOfBirth,
  text1,
  text2,
  text3,
}) => (
  <CardWrapper tag={tag}>
    <div className={style.wrapper}>
      <img className={style.img} src={img} alt="" />
      <h4 className={style.name}>{name}</h4>
      {title && <h5 className={style.title}>{title}</h5>}
      {sex && dateOfBirth && (
        <p className={style.subtitle}>
          {sex}
          {', '}
          {formatDistanceToNow(parseISO(dateOfBirth))}
          {' '}
          old
        </p>
      )}
      <ul className={style.list}>
        {text1 && <li className={style.text}>{text1}</li>}
        {text2 && <li className={style.text}>{text2}</li>}
        {text3 && <li className={style.text}>{text3}</li>}
      </ul>
    </div>
  </CardWrapper>
);

export default AnimalProfileCard;
