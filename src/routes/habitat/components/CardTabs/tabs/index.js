import { h } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { connect } from 'react-redux';
import { buildURL, post } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';
import { hasPermission } from 'Components/Authorize';
import List from 'Components/List';
import ClickMessageTip from 'Components/ClickMessageTip';

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
  SCHEDULES,
} from '../constants';

import AlbumIcon from './icons/Album.svg';
import AnimalInfoIcon from './icons/AnimalInfo.svg';
import BodyIcon from './icons/Body.svg';
import CalendarIcon from './icons/Calendar.svg';
import FamilyIcon from './icons/Family.svg';
import QuestionsIcon from './icons/Question.svg';
import QuizIcon from './icons/Quiz.svg';

import Tab from './Tab/Tab';

import style from './style.scss';

const Tabs = ({
  activeTab,
  habitatId,
  isAlbumClicked,
  isStreamClicked,
  setActiveTabAction,
  updateUserPropertyAction,
}) => {
  const listRef = useRef();
  const isTabbed = useIsHabitatTabbed();
  const onClick = useCallback((tab) => () => {
    logGAEvent('Tab-Navigation-Desktop', tab, habitatId);

    setActiveTabAction(tab);

    if (!isAlbumClicked && tab === ALBUM) {
      post(buildURL('users/steps'), { step: 'isAlbumClicked', value: true })
        .then((data) => updateUserPropertyAction(data))
        .catch((err) => console.error('Error while updating album click indicator', err));
    }
  }, [habitatId, setActiveTabAction, isAlbumClicked, updateUserPropertyAction]);

  // reset on unload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setActiveTabAction(MEET), []);

  useEffect(() => {
    listRef.current.updateLayout();
  }, []);

  return (
    <div className={style.tabsContainer}>
      <List className={style.carousel} ref={listRef}>
        {!isTabbed && (
          <Tab
            active={activeTab === ALBUM}
            title="Album"
            description="Updates, photos, clips, past talks, and more"
            onClick={onClick(ALBUM)}
            color="#769DFF"
            iconTip={(
              <ClickMessageTip
                align={{ bottom: 'top' }}
                disable={isAlbumClicked || !isStreamClicked}
                text="View photos and clips"
                largeIndicator
              >
                <img src={AlbumIcon} alt="" style={{ position: 'relative', zIndex: '1' }} />
              </ClickMessageTip>
            )}
          />
        )}

        <Tab
          active={activeTab === INFO}
          title="The Species"
          description="Learn about their habitat, behaviour, and more"
          onClick={onClick(INFO)}
          color="#19705A"
          icon={AnimalInfoIcon}
        />

        <Tab
          active={activeTab === MEET}
          title="The Family"
          description="Get to know the members of this habitat"
          onClick={onClick(MEET)}
          color="#FF97E5"
          icon={FamilyIcon}
        />

        <Tab
          active={activeTab === QUESTIONS}
          title="Q&A"
          description="Ask questions and start discussions"
          onClick={onClick(QUESTIONS)}
          color="#FF6E40"
          icon={QuestionsIcon}
        />

        {hasPermission('habitat:edit-schedule') && (
          <Tab
            active={activeTab === CALENDAR}
            title="Calendar"
            description="See when this habitat is online and event times"
            onClick={onClick(CALENDAR)}
            color="#C9D341"
            icon={CalendarIcon}
          />
        )}

        <Tab
          active={activeTab === SCHEDULES}
          title="Schedules"
          description="See when this habitat is online and event times"
          onClick={onClick(SCHEDULES)}
          color="#C9D341"
          icon={CalendarIcon}
        />

        <Tab
          active={activeTab === BODY}
          title="The Body"
          description="Explore different parts of the animal body"
          onClick={onClick(BODY)}
          color="#F05E64"
          icon={BodyIcon}
        />

        <Tab
          active={activeTab === QUIZ}
          title="Quiz"
          description="Test your knowledge of the species with a fun quiz"
          onClick={onClick(QUIZ)}
          color="#418589"
          icon={QuizIcon}
        />
      </List>
    </div>
  );
};

export default connect(({
  user: { isAlbumClicked, isStreamClicked },
  habitat: { habitatInfo: { _id: habitatId }, cards: { activeTab } },
}) => ({
  isAlbumClicked,
  isStreamClicked,
  habitatId,
  activeTab,
}), {
  setActiveTabAction: setActiveTab,
  updateUserPropertyAction: updateUserProperty,
})(Tabs);
