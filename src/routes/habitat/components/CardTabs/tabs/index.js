import { h } from 'preact';
import { memo } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarStar,
  faInfoCircle,
  faPaw,
  faPuzzlePiece,
  faUsers,
} from '@fortawesome/pro-solid-svg-icons';

import {
  MEET,
  INFO,
  BODY,
  QUIZ,
  CALENDAR,
} from '../constants';

import ToggleButton from '../toggleButton';

import style from './style.scss';

const Tabs = ({ active, onClick }) => (
  <div>
    <ToggleButton
      className={style.tabBtn}
      active={active === MEET}
      value={MEET}
      onClick={onClick}
    >
      <FontAwesomeIcon className={style.icon} icon={faUsers} />
      Meet The Family
    </ToggleButton>

    <ToggleButton
      className={style.tabBtn}
      active={active === INFO}
      value={INFO}
      onClick={onClick}
    >
      <FontAwesomeIcon className={style.icon} icon={faInfoCircle} />
      Animal Info
    </ToggleButton>

    <ToggleButton
      className={style.tabBtn}
      active={active === BODY}
      value={BODY}
      onClick={onClick}
    >
      <FontAwesomeIcon className={style.icon} icon={faPaw} />
      The Body
    </ToggleButton>

    <ToggleButton
      className={style.tabBtn}
      active={active === QUIZ}
      value={QUIZ}
      onClick={onClick}
    >
      <FontAwesomeIcon className={style.icon} icon={faPuzzlePiece} />
      Quiz
    </ToggleButton>

    <ToggleButton
      className={style.tabBtn}
      active={active === CALENDAR}
      value={CALENDAR}
      onClick={onClick}
    >
      <FontAwesomeIcon className={style.icon} icon={faCalendarStar} />
      Calendar
    </ToggleButton>
  </div>
);

export default memo(Tabs);
