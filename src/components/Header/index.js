import { h } from 'preact';
import { Header } from 'grommet';

import NavBar from '../NavBar';
import ZoolifeLogo from '../ZoolifeLogo';
import AdminMenu from '../async/Menu';
import UserMenu from './Menu';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <AdminMenu />
    <div className={style.logo}>
      <ZoolifeLogo />
    </div>
    <NavBar />
    <UserMenu />
  </Header>
);

export default HeaderComponent;
