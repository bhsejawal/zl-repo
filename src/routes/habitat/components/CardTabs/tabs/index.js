import { h } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { connect } from 'react-redux';
import { logGAEvent } from 'Shared/ga';
import List from 'Components/List';

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
  role,
  setActiveTabAction,
}) => {
  const listRef = useRef();
  const onClick = useCallback((tab) => () => {
    logGAEvent('Tab-Navigation-Desktop', tab, habitatId);

    setActiveTabAction(tab);
  }, [habitatId, setActiveTabAction]);

  // reset on unload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setActiveTabAction(ALBUM), []);

  useEffect(() => {
    listRef.current.updateLayout();
  }, []);

  return (
    <div className={style.tabsContainer}>
      <List className={style.carousel} ref={listRef}>
        <Tab
          active={activeTab === ALBUM}
          title="Album"
          description="Updates, photos, clips, past talks, and more"
          onClick={onClick(ALBUM)}
          color="#769DFF"
          icon={AlbumIcon}
        />

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

        {role === 'admin' && (
          <Tab
            active={activeTab === CALENDAR}
            title="Calendar"
            description="See when this habitat is online and event times"
            onClick={onClick(CALENDAR)}
            color="#C9D341"
            icon={CalendarIcon}
          />
        )}
      </List>
    </div>
  );
};

export default connect(({
  habitat: { habitatInfo: { _id: habitatId }, cards: { activeTab } },
  user: { role },
}) => ({
  habitatId,
  activeTab,
  role,
}), { setActiveTabAction: setActiveTab })(Tabs);
