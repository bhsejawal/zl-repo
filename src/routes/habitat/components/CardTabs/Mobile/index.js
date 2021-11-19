import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { batch, connect } from 'react-redux';
import { Box } from 'grommet';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import { hasPermission } from 'Components/Authorize';
import LoaderModal from 'Components/LoaderModal';
import CalendarModal from './CalendarModal';
import QuestionsModal from './QuestionsModal';

import { fetchCards } from '../api';
import { setCards, setLoading } from '../actions';
import {
  openModalCalendar,
  openModalCards,
  openModalQuestions,
  openModalSchedules,
  openModalAlbum,
  closeModalCards,
  closeModalAlbum,
  closeModalQuestions,
  closeModalCalendar,
  closeModalSchedules,
} from './actions';
import {
  BODY,
  INFO,
  MEET,
  QUIZ,
  QUIZ_CARD_TYPE,
} from '../constants';

import Tab from '../tabs/Tab/Tab';
import AnimalInfoIcon from '../tabs/icons/AnimalInfo.svg';
import FamilyIcon from '../tabs/icons/Family.svg';
import QuestionsIcon from '../tabs/icons/Question.svg';
import CalendarIcon from '../tabs/icons/Calendar.svg';
import BodyIcon from '../tabs/icons/Body.svg';
import QuizIcon from '../tabs/icons/Quiz.svg';
import AlbumIcon from '../tabs/icons/Album.svg';
import SchedulesModal from './ScheduleModal';
import AlbumModal from './AlbumModal';

const MobileCardsModal = lazy(() => import('./CardsModal'));

const SmallScreenCardTabs = ({
  habitatId,
  activeMobileCardsTab,
  calendarCardOpen,
  questionsCardOpen,
  schedulesCardOpen,
  albumCardOpen,
  setLoadingAction,
  setCardsAction,
  openModalCardsAction,
  closeModalCardsAction,
  openModalCalendarAction,
  closeModalCalendarAction,
  openModalQuestionsAction,
  closeModalQuestionsAction,
  openModalSchedulesAction,
  closeModalSchedulesAction,
  openModalAlbumAction,
  closeModalAlbumAction,
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

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const activeCard = urlParams.get('card');

    const openCardModal = (cardType) => {
      switch (cardType) {
        case 'album': {
          openModalAlbumAction();
          break;
        }

        case 'species': {
          onCardBtnClick(INFO);
          break;
        }

        case 'family': {
          onCardBtnClick(MEET);
          break;
        }

        case 'questions': {
          openModalQuestionsAction();
          break;
        }

        case 'schedules': {
          openModalSchedulesAction();
          break;
        }

        case 'calendar': {
          openModalCalendarAction();
          break;
        }

        case 'body': {
          onCardBtnClick(BODY);
          break;
        }

        case 'quiz': {
          onCardBtnClick(QUIZ);
          break;
        }

        default: {
          break;
        }
      }
    };

    // this checks if there is any card modal should be open, if not close all card modals
    const onPopState = () => {
      const cardType = new URLSearchParams(window.location.search).get('card');

      if (!cardType) {
        closeModalCardsAction();
        closeModalAlbumAction();
        closeModalQuestionsAction();
        closeModalCalendarAction();
        closeModalSchedulesAction();
      } else {
        openCardModal(cardType);
      }
    }

    // this is triggered on both back and forward browser navigation
    window.addEventListener('popstate', onPopState);

    openCardModal(activeCard);

    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        pad={{ bottom: 'medium' }}
        margin={{ bottom: 'large' }}
        direction="row"
        overflow={{ horizontal: 'auto' }}
      >
        <Tab
          param="album"
          title="Album"
          description="Updates, photos, clips, past talks, and more"
          onClick={openModalAlbumAction}
          color="#769DFF"
          icon={AlbumIcon}
        />

        <Tab
          param="species"
          title="The Species"
          description="Learn about their habitat, behaviour, and more"
          onClick={() => onCardBtnClick(INFO)}
          color="#19705A"
          icon={AnimalInfoIcon}
        />

        <Tab
          param="family"
          title="The Family"
          description="Get to know the members of this habitat"
          onClick={() => onCardBtnClick(MEET)}
          color="#FF97E5"
          icon={FamilyIcon}
        />

        <Tab
          param="questions"
          title="Q&A"
          description="Ask questions and start discussions"
          onClick={openModalQuestionsAction}
          color="#FF6E40"
          icon={QuestionsIcon}
        />

        {hasPermission('habitat:edit-schedule') && (
          <Tab
            param="calendar"
            title="Calendar"
            description="See when this habitat is online and event times"
            onClick={openModalCalendarAction}
            color="#C9D341"
            icon={CalendarIcon}
          />
        )}

        <Tab
          param="schedules"
          title="Schedules"
          description="See when this habitat is online and event times"
          onClick={openModalSchedulesAction}
          color="#C9D341"
          icon={CalendarIcon}
        />

        <Tab
          param="body"
          title="The Body"
          description="Explore different parts of the animal body"
          onClick={() => onCardBtnClick(BODY)}
          color="#F05E64"
          icon={BodyIcon}
        />

        <Tab
          param="quiz"
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

      {schedulesCardOpen && (
        <SchedulesModal />
      )}

      {albumCardOpen && (
        <AlbumModal />
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
          schedulesCardOpen,
          albumCardOpen,
        },
      },
    },
  }) => ({
    habitatId,
    activeMobileCardsTab,
    calendarCardOpen,
    questionsCardOpen,
    schedulesCardOpen,
    albumCardOpen,
  }),
  {
    setCardsAction: setCards,
    setLoadingAction: setLoading,
    openModalCardsAction: openModalCards,
    closeModalCardsAction: closeModalCards,
    openModalCalendarAction: openModalCalendar,
    closeModalCalendarAction: closeModalCalendar,
    openModalQuestionsAction: openModalQuestions,
    closeModalQuestionsAction: closeModalQuestions,
    openModalSchedulesAction: openModalSchedules,
    closeModalSchedulesAction: closeModalSchedules,
    openModalAlbumAction: openModalAlbum,
    closeModalAlbumAction: closeModalAlbum,
  },
)(SmallScreenCardTabs);
