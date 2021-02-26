import { h } from 'preact';

import Description from './description';
import Info from './info';
import Members from './members';

import style from './style.scss';

const StreamProfile = () => (
  <div className={style.profile}>
    <Info />
    <Members />
    <Description />
  </div>
);

export default StreamProfile;
