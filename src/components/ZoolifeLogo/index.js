import { h } from 'preact';
import { Link } from 'preact-router';
import { connect } from 'react-redux';
import Tag from 'Components/Tag';
import zoolifeLogo from './zoolife.svg';

import style from './style.scss';

const ZoolifeLogo = ({ landing, isLoggedIn }) => (
  <div>
    <Link href={isLoggedIn ? '/map' : '/' }>
      <img className={style.img} src={zoolifeLogo} alt="" />
    </Link>
    {landing && <Tag label="beta" varient="light" />}
  </div>
);

export default connect(({ user: { logged }}) => ({ isLoggedIn: logged }))(ZoolifeLogo);
