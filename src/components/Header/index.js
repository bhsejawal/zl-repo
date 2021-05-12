import { h } from 'preact';
import { Header } from 'grommet';

import NavBar from '../NavBar';
import ZoolifeLogo from '../ZoolifeLogo';
import UserMenu from './Menu';
import Search from './Search';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <div className={style.logo}>
      <ZoolifeLogo />
      <Search className={style.search} />
    </div>

    <div>
      <NavBar />
      <UserMenu />
    </div>
  </Header>
);

export default HeaderComponent;
