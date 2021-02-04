import { h } from 'preact';
import { Link } from 'preact-router';
import { Header } from 'grommet';

import NavBar from '../NavBar';
import ZoolifeLogo from '../ZoolifeLogo';
import AnimalIcon from '../AnimalIcon';
import Menu from '../async/Menu';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <Menu />
    <div className={style.logo}>
      <ZoolifeLogo />
    </div>
    <NavBar />
    <div className={style.userImageSection}>
      <Link href="/profile">
        <AnimalIcon />
      </Link>
    </div>
  </Header>
);

export default HeaderComponent;
