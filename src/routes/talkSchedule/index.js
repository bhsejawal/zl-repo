import { h } from 'preact';

import PageWrapper from 'Components/Main/PageWrapper';

import Header from '../home/Header';
import Schedule from '../schedule';

import style from './style.scss';

const TalkSchedule = () => (
  <div className={style.body}>
    <Header />
    <PageWrapper>
      <Schedule />
    </PageWrapper>
  </div>
);

export default TalkSchedule;
