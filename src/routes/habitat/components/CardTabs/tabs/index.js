import { h } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faPaw,
  faCalendarStar,
  faPuzzlePiece,
  faUsers,
} from '@fortawesome/pro-regular-svg-icons';

import { setActiveTab } from '../actions';
import {
  MEET,
  INFO,
  BODY,
  QUIZ,
  CALENDAR,
} from '../constants';

import ToggleButton from '../toggleButton';

import style from './style.scss';

const Tabs = ({ active, setActiveTabAction }) => {
  const onClick = useCallback(({ target }) => {
    setActiveTabAction(target.dataset.value);
  }, [setActiveTabAction]);

  // reset on unload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setActiveTabAction(MEET), []);

  return (
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
};

export default connect(
  null,
  { setActiveTabAction: setActiveTab },
)(Tabs);
