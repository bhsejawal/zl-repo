import { h } from 'preact';

import Header from 'Components/Header';
import { Main } from 'grommet';

import style from './style.scss';

const Home = () => (
  <div className={style.home}>
    <Header />
    <Main fill pad={{top: 'var(--headerHeight)', horizontal: '40px', bottom: '40px'}}>
      <h1>Home</h1>
    </Main>
  </div>
);

export default Home;
