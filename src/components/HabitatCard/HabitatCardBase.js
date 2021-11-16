import { h } from 'preact';
import classnames from 'classnames';

import HabitatStatus from './HabitatStatus';

import zooPlaceholder from './zooPlaceholder.png';

import style from './style.scss';

const BaseHabitatCard = ({
  className,
  online,
  liveTalk,
  image,
  logo,
  children,
  free = false,
}) => (
  <div className={classnames(style.habitatCard, className)}>
    <div className={classnames(style.header, {[style.fallback]: !image})}>
      <div className={style.wideImage}>{image && <img src={image} alt="" />}</div>
      <div className={style.logo}>
        <img src={logo ?? zooPlaceholder} alt="" />
      </div>
      <HabitatStatus className={style.tag} online={online} liveTalk={liveTalk} free={free} />
    </div>
    <div className={style.body}>
      {children}
    </div>
  </div>
);

export default BaseHabitatCard;
