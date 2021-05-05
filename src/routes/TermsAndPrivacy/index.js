import { h } from 'preact';

import Header from '../home/Header';

import style from './style.scss';

const TermsAndPrivacy = ({ pdfLink, title }) => (
  <div className={style.pdfWrapper}>
    <Header />
    <iframe
      width="100%"
      height="100%"
      src={`${pdfLink}#toolbar=0`}
      title={title}
    />
  </div>
);

export default TermsAndPrivacy;
