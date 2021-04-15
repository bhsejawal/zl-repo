import { h } from 'preact';
import { Header } from 'grommet';

import ZoolifeLogo from 'Components/ZoolifeLogo';
import NavBar from 'Components/NavBar';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <div className={style.logo}>
      <ZoolifeLogo landing />
    </div>
    <NavBar landing />
  </Header>
);

export default HeaderComponent;
