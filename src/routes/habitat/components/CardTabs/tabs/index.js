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
import { faPhotoVideo } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import ClickMessageTip from 'Components/ClickMessageTip';

import { setAlbumClicked } from '../../../../../redux/actions';
import { useIsHabitatTabbed } from '../../../../../hooks';
import { setActiveTab } from '../actions';
import {
  MEET,
  INFO,
  BODY,
  QUIZ,
  CALENDAR,
  ALBUM,
} from '../constants';

import ToggleButton from '../toggleButton';

import style from './style.scss';

const Tabs = ({
  active,
  albumClicked,
  streamClicked,
  setActiveTabAction,
  setAlbumClickedAction,
}) => {
  const isTabbed = useIsHabitatTabbed();
  const onClick = useCallback(({ target }) => {
    setActiveTabAction(target.dataset.value);
    setAlbumClickedAction(target.dataset.value === ALBUM);
  }, [setActiveTabAction, setAlbumClickedAction]);

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

      {!isTabbed && (
        <ToggleButton
          className={classnames(style.tabBtn, { [style.albumClickIndicator]: !albumClicked })}
          active={active === ALBUM}
          value={ALBUM}
          onClick={onClick}
        >
          <ClickMessageTip
            align={{ bottom: 'top' }}
            disable={albumClicked || !streamClicked}
            text="View photos and clips">
            <FontAwesomeIcon className={style.icon} icon={faPhotoVideo} />
          </ClickMessageTip>
          Album
        </ToggleButton>
      )}
    </div>
  );
};

export default connect(
  ({ user: { albumClicked, streamClicked } }) => ({ albumClicked, streamClicked }),
  {
    setActiveTabAction: setActiveTab,
    setAlbumClickedAction: setAlbumClicked,
  },
)(Tabs);
