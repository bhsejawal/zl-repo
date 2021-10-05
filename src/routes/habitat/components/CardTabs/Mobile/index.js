import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { batch, connect } from 'react-redux';
import { Box } from 'grommet';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import LoaderModal from 'Components/LoaderModal';
import CalendarModal from './CalendarModal';
import QuestionsModal from './QuestionsModal';

import { fetchCards } from '../api';
import { setCards, setLoading } from '../actions';
import { openModalCalendar, openModalCards, openModalQuestions } from './actions';
import {
  BODY,
  INFO,
  MEET,
  QUIZ,
  QUIZ_CARD_TYPE,
} from '../constants';

import Tab from "../tabs/Tab/Tab";
import AnimalInfoIcon from "../tabs/icons/AnimalInfo.svg";
import FamilyIcon from "../tabs/icons/Family.svg";
import QuestionsIcon from "../tabs/icons/Question.svg";
import CalendarIcon from "../tabs/icons/Calendar.svg";
import BodyIcon from "../tabs/icons/Body.svg";
import QuizIcon from "../tabs/icons/Quiz.svg";

const MobileCardsModal = lazy(() => import('./CardsModal'));

const SmallScreenCardTabs = ({
  habitatId,
  activeMobileCardsTab,
  calendarCardOpen,
  questionsCardOpen,
  setLoadingAction,
  setCardsAction,
  openModalCardsAction,
  openModalCalendarAction,
  openModalQuestionsAction,
}) => {
  const { get } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  // we need this to load family members
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingAction(true);
        const { cards: newCards } = await fetchCards(habitatId, MEET);
        setCardsAction(newCards);
      } catch (err) {
        // TODO: implement error UI
        console.error(err);
      } finally {
        setLoadingAction(false);
      }
    };

    if (habitatId) {
      load();
    }
  }, [habitatId, setCardsAction, setLoadingAction]);

  const onCardBtnClick = async (cardType) => {
    batch(() => {
      openModalCardsAction(cardType);
      setLoadingAction(true);
    });

    try {
      const { cards: newCards } = await fetchCards(habitatId, cardType);

      await Promise.all(newCards.map(async (card) => {
        // quiz cards have trivia question IDs in data which needs to be mapped
        // into questions, and we also need to map answers
        if (card.type === QUIZ_CARD_TYPE) {
          const cardData = await get(`cards/${card._id}/questions`);
          // eslint-disable-next-line no-param-reassign
          card.data = cardData;
        }
      }));

      setCardsAction(newCards);
    } catch (err) {
      // TODO: implement error UI
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <Box
        pad={{ bottom: 'medium' }}
        margin={{ bottom: 'large' }}
        direction="row"
        overflow={{ horizontal: 'auto' }}
      >
        <Tab
          title="The Species"
          description="Learn about their habitat, behaviour, and more"
          onClick={() => onCardBtnClick(INFO)}
          color="#19705A"
          icon={AnimalInfoIcon}
        />

        <Tab
          title="The Family"
          description="Get to know the members of this habitat"
          onClick={() => onCardBtnClick(MEET)}
          color="#FF97E5"
          icon={FamilyIcon}
        />

        <Tab
          title="Q&A"
          description="Ask questions and start discussions"
          onClick={openModalQuestionsAction}
          color="#FF6E40"
          icon={QuestionsIcon}
        />

        <Tab
          title="Schedule"
          description="See when this habitat is online and event times"
          onClick={openModalCalendarAction}
          color="#C9D341"
          icon={CalendarIcon}
        />

        <Tab
          title="The Body"
          description="Explore different parts of the animal body"
          onClick={() => onCardBtnClick(BODY)}
          color="#F05E64"
          icon={BodyIcon}
        />

        <Tab
          title="Quiz"
          description="Test your knowledge of the species with a fun quiz"
          onClick={() => onCardBtnClick(QUIZ)}
          color="#418589"
          icon={QuizIcon}
        />
      </Box>

      {activeMobileCardsTab && (
        <Suspense fallback={<LoaderModal />}>
          <MobileCardsModal />
        </Suspense>
      )}

      {calendarCardOpen && (
        <CalendarModal />
      )}

      {questionsCardOpen && (
        <QuestionsModal />
      )}
    </>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
      },
      cards: {
        mobile: {
          activeMobileCardsTab,
          calendarCardOpen,
          questionsCardOpen,
        },
      },
    },
  }) => ({
    habitatId,
    activeMobileCardsTab,
    calendarCardOpen,
    questionsCardOpen,
  }),
  {
    setCardsAction: setCards,
    setLoadingAction: setLoading,
    openModalCardsAction: openModalCards,
    openModalCalendarAction: openModalCalendar,
    openModalQuestionsAction: openModalQuestions,
  },
)(SmallScreenCardTabs);
