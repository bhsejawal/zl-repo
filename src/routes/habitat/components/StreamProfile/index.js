import { h } from 'preact';

import Description from './description';
import Info from './info';

import style from './style.scss';

const StreamProfile = () => (
  <div className={style.profile}>
    <Info />
    <Description />
  </div>
);

export default StreamProfile;
