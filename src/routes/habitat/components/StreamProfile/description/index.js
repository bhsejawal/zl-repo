import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldCheck } from '@fortawesome/pro-light-svg-icons';

import style from './style.scss';

const Description = ({ text }) => (
  <div className={style.desc}>
    <FontAwesomeIcon icon={faShieldCheck} size="2x" color="var(--turquoiseLight)" />
    <p className={style.text}>{text}</p>
  </div>
);

export default Description;
