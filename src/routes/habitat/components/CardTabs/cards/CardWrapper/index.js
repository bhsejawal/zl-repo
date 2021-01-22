import { h } from 'preact';

import style from './style.scss';

const CardWrapper = ({
  tag,
  color = 'var(--lightBlue)',
  tagColor = 'var(--oceanBlue)',
  children,
}) => (
  <div className={style.card} style={{ backgroundColor: color }}>
    <span className={style.tag} style={{ backgroundColor: tagColor }}>{tag}</span>
    {children}
  </div>
);

export default CardWrapper;
