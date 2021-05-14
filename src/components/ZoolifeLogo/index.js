import { h } from 'preact';
import { Link } from 'preact-router';
import Tag from 'Components/Tag';
import zoolifeLogo from './zoolife.svg';

import style from './style.scss';

const ZoolifeLogo = ({ landing }) => (
  <div>
    <Link href="/">
      <img className={style.img} src={zoolifeLogo} alt="" />
    </Link>
    {landing && <Tag label="invite only" varient="light" />}
  </div>
);

export default ZoolifeLogo;
