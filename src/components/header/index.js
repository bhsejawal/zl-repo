import { h } from 'preact';

import NavBar from '../NavBar';
import ZoolifeLogo from '../ZoolifeLogo';
import AnimalIcon from './AnimalIcon';

import style from './style.scss';

const Header = () => (
  <header className={style.header}>
    <div className={style.logo}>
      <ZoolifeLogo />
    </div>
    <NavBar />
    <div className={style.userImageSection}>
      <AnimalIcon />
    </div>
  </header>
);

export default Header;
