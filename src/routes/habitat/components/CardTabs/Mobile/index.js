import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { batch, connect } from 'react-redux';
import { Box } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faPaw,
  faPuzzlePiece,
  faUser,
  faCalendarStar,
} from '@fortawesome/pro-light-svg-icons';
import { faBullhorn } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import LoaderModal from 'Components/LoaderModal';
import CardButton from './CardButton';
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
        <CardButton
          onClick={openModalQuestionsAction}
          icon={<FontAwesomeIcon size="3x" color="var(--hunterGreenMediumLight)" icon={faBullhorn} />}
          label="Q&A"
          color="var(--mossLight)"
        />

        <CardButton
          onClick={() => onCardBtnClick(MEET)}
          icon={<FontAwesomeIcon size="3x" color="var(--blueDark)" icon={faUser} />}
          label="The Family"
          color="var(--blueLight)"
        />

        <CardButton
          onClick={() => onCardBtnClick(INFO)}
          icon={<FontAwesomeIcon size="3x" color="var(--coral)" icon={faInfoCircle} />}
          label="The Species"
          color="var(--coralLight)"
        />

        <CardButton
          onClick={() => onCardBtnClick(BODY)}
          icon={<FontAwesomeIcon size="3x" color="var(--moss)" icon={faPaw} />}
          label="The Body"
          color="var(--mossLight)"
        />

        <CardButton
          onClick={() => onCardBtnClick(QUIZ)}
          icon={<FontAwesomeIcon size="3x" color="var(--lavender)" icon={faPuzzlePiece} />}
          label="Quiz"
          color="var(--lavenderLight)"
        />

        <CardButton
          onClick={openModalCalendarAction}
          icon={<FontAwesomeIcon size="3x" color="var(--hunterGreen)" icon={faCalendarStar} />}
          label="Calendar"
          color="var(--hunterGreenLight)"
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
