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
import { faPhotoVideo, faBullhorn } from '@fortawesome/pro-solid-svg-icons';
import { buildURL, post } from 'Shared/fetch';
import classnames from 'classnames';

import ClickMessageTip from 'Components/ClickMessageTip';
import { logGAEvent } from 'Shared/ga';

import { updateUserProperty } from '../../../../../redux/actions';
import { useIsHabitatTabbed } from '../../../../../hooks';
import { setActiveTab } from '../actions';
import {
  MEET,
  INFO,
  BODY,
  QUIZ,
  CALENDAR,
  ALBUM,
  QUESTIONS,
} from '../constants';

import ToggleButton from '../toggleButton';

import style from './style.scss';

const Tabs = ({
  active,
  habitatId,
  isAlbumClicked,
  isStreamClicked,
  setActiveTabAction,
  updateUserPropertyAction,
}) => {
  const isTabbed = useIsHabitatTabbed();
  const onClick = useCallback(({ target }) => {
    logGAEvent(
      'Tab-Navigation-Desktop',
      target.dataset.value,
      habitatId,
    );

    setActiveTabAction(target.dataset.value);

    if (!isAlbumClicked && target.dataset.value === ALBUM) {
      post(buildURL('users/steps'), { step: 'isAlbumClicked', value: true })
        .then((data) => updateUserPropertyAction(data))
        .catch((err) => console.error('Error while updating album click indicator', err));
    }
  }, [habitatId, setActiveTabAction, isAlbumClicked, updateUserPropertyAction]);

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
        active={active === QUESTIONS}
        value={QUESTIONS}
        onClick={onClick}
      >
        <FontAwesomeIcon className={style.icon} icon={faBullhorn} />
        Q&A
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
          className={classnames(style.tabBtn, { [style.albumClickIndicator]: !isAlbumClicked })}
          active={active === ALBUM}
          value={ALBUM}
          onClick={onClick}
        >
          <ClickMessageTip
            align={{ bottom: 'top' }}
            disable={isAlbumClicked || !isStreamClicked}
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
  ({
    user: { isAlbumClicked, isStreamClicked },
    habitat: { habitatInfo: { _id: habitatId } },
  }) => ({ isAlbumClicked, isStreamClicked, habitatId }),
  {
    setActiveTabAction: setActiveTab,
    updateUserPropertyAction: updateUserProperty,
  },
)(Tabs);
