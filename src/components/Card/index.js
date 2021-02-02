import { h } from 'preact';
import classnames from 'classnames';

import Button from '../Button';

import style from './style.scss';

const Card = ({
  header,
  description,
  image,
  onClick,
  live,
  loading,
  roundImage,
}) => (
  <div className={classnames(style.card, { [style.loading]: loading })}>
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={classnames(style.header, { shimmer: loading })}>{header}</div>
        <div className={classnames(style.description, { shimmer: loading })}>{description}</div>
        <Button className={classnames({ shimmer: loading })} variant={live ? 'secondary' : 'outline'} size="xs" onClick={onClick}>Remind Me</Button>
      </div>
      <div className={style.image}>
        <img src={image} alt="" className={classnames({ [style.round]: roundImage })} />
      </div>
    </div>
  </div>
);

export default Card;
