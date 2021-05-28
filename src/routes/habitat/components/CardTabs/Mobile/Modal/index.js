import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { batch, connect } from 'react-redux';
import { Box, Button, Layer } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import useFetch from 'use-http';

import SingleIconCard from 'Cards/SingleIconCard';
import ThreeIconsCard from 'Cards/ThreeIconsCard';
import FourIconsCard from 'Cards/FourIconsCard';
import AnimalProfileCard from 'Cards/AnimalProfileCard';
import ConservationCard from 'Cards/ConservationCard';
import TwoVideosCard from 'Cards/TwoVideosCard';
import SingleVideoCard from 'Cards/SingleVideoCard';
import OriginAndHabitatCard from 'Cards/OriginAndHabitatCard';
import AnimalBodyCard from 'Cards/AnimalBodyCard';
import QuizCard from 'Cards/QuizCard';
import LoaderModal from 'Components/LoaderModal';

import { API_BASE_URL } from 'Shared/fetch';
import { fetchCards } from '../../api';
import { setCards, setLoading } from '../../actions';
import {
  closeModalCards,
  nextCard,
  openModalCards,
  prevCard,
  resetCardInd,
} from '../actions';
import {
  ANIMAL_BODY_CARD_TYPE,
  ANIMAL_PROFILE_CARD_TYPE,
  CONSERVATION_CARD_TYPE,
  FOUR_ICONS_CARD_TYPE,
  ORIGIN_AND_HABITAT_CARD_TYPE,
  QUIZ_CARD_TYPE,
  SINGLE_ICON_CARD_TYPE,
  SINGLE_VIDEO_CARD_TYPE,
  THREE_ICONS_CARD_TYPE,
  TWO_VIDEOS_CARD_TYPE,
  MEET,
  INFO,
  BODY,
  QUIZ,
} from '../../constants';

import style from './style.scss';

const allCardTypes = [MEET, INFO, BODY, QUIZ];

const MobileCardsModal = ({
  habitatId,
  loading,
  cards,
  activeMobileCardsTab,
  activeCardIndex,
  closeAction,
  openModalCardsAction,
  setLoadingAction,
  setCardsAction,
  nextCardAction,
  prevCardAction,
  resetCardIndAction,
}) => {
  const cardWrapperRef = useRef();
  const card = cards?.[activeCardIndex];
  const cardsLen = cards?.length;
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const { get } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useLayoutEffect(() => {
    setProgress(0);
  }, [activeCardIndex]);

  useEffect(() => {
    // TODO: this is not working perfectly.
    // pause value change, as well as activeCardIndex change
    // should restart the timeout
    const timeout = setTimeout(() => {
      if (paused) {
        return;
      }

      if (progress >= 100) {
        setProgress(0);
        nextCardAction(cardsLen);
      } else {
        setProgress(progress + 10);
      }
    }, 300);

    return () => clearInterval(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, paused]);

  // eslint-disable-next-line consistent-return
  const onClick = useCallback((evt) => {
    const { clientX, clientY, view } = evt;

    // controls are on top and we'll just ignore this click if it's to close to controls
    if (clientY < 60) {
      return undefined;
    }

    if (clientX < 60) {
      return prevCardAction();
    }

    if (view.innerWidth - clientX < 60) {
      return nextCardAction(cardsLen);
    }

    if (cardWrapperRef.current?.firstChild === evt.target) {
      setPaused(!paused);
    }
  }, [cardsLen, nextCardAction, paused, prevCardAction]);

  const onVideoPlayStarted = useCallback(() => {
    setPaused(true);
  }, []);

  const onVideoPlayStopped = useCallback(() => {
    setPaused(false)
  }, []);

  useEffect(() => {
    resetCardIndAction();
  }, [cards, resetCardIndAction]);

  useEffect(() => {
    const load = async (nextCardType) => {
      batch(() => {
        openModalCardsAction(nextCardType);
        setLoadingAction(true);
      });

      try {
        const { cards: newCards } = await fetchCards(habitatId, nextCardType);

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

    if (activeCardIndex === cardsLen) {
      const currentCardTypeInd = allCardTypes.indexOf(activeMobileCardsTab);
      const nextInd = (currentCardTypeInd + 1) % allCardTypes.length;
      const nextCardType = allCardTypes[nextInd];
      load(nextCardType);
    } else if (activeCardIndex === -1) {
      const currentCardTypeInd = allCardTypes.indexOf(activeMobileCardsTab);
      const prevInd = (allCardTypes.length + currentCardTypeInd - 1) % allCardTypes.length;
      const prevCardType = allCardTypes[prevInd];
      load(prevCardType);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCardIndex, cardsLen]);

  const closeButton = useMemo(() => (
    <Box className={style.controls}>
      <Box
        direction="row"
        align="center"
        justify="end"
        as="header"
      >
        <Button
          plain
          margin="small"
          onClick={closeAction}
          icon={<FontAwesomeIcon size="lg" color="var(--charcoalLight)" icon={faTimes} />}
        />
      </Box>
    </Box>
  ), [closeAction]);

  if (loading || activeCardIndex === cardsLen || activeCardIndex === -1) {
    return (
      <Layer>
        <Box pad={{ top: 'medium' }} height="3px" />
        {closeButton}
        <LoaderModal />
      </Layer>
    );
  }

  return (
    <Layer onEsc={closeAction} onClick={onClick}>
      <Box className={style.controls} direction="row" pad={{ top: 'medium', horizontal: 'medium' }}>
        {cards.map((_el, ind) => (
          <div className={style.indIndicator}>
            {ind <= activeCardIndex && (
              <div
                className={classnames(style.timeIndicator, { [style.done]: ind < activeCardIndex })}
                style={{ width: ind === activeCardIndex ? `${progress}%` : undefined }}
              />
            )}
          </div>
        ))}
      </Box>

      {closeButton}

      <div className={style.cardWrapper} ref={cardWrapperRef}>
        {card?.type === SINGLE_ICON_CARD_TYPE && (
          <SingleIconCard
            className={style.card}
            tag={card.tag}
            title={card.data.title}
            img={card.data.img}
            text={card.data.text}
          />
        )}

        {card?.type === THREE_ICONS_CARD_TYPE && (
          <ThreeIconsCard
            className={style.card}
            tag={card.tag}
            title={card.data.title}
            img1={card.data.img1}
            text1={card.data.text1}
            img2={card.data.img2}
            text2={card.data.text2}
            img3={card.data.img3}
            text3={card.data.text3}
          />
        )}

        {card?.type === FOUR_ICONS_CARD_TYPE && (
          <FourIconsCard
            className={style.card}
            tag={card.tag}
            title={card.data.title}
            text={card.data.text}
            img1={card.data.img1}
            icon1Txt={card.data.icon1Txt}
            img2={card.data.img2}
            icon2Txt={card.data.icon2Txt}
            img3={card.data.img3}
            icon3Txt={card.data.icon3Txt}
            img4={card.data.img4}
            icon4Txt={card.data.icon4Txt}
          />
        )}

        {card?.type === ANIMAL_PROFILE_CARD_TYPE && (
          <AnimalProfileCard
            className={style.card}
            tag={card.tag}
            img={card.data.img}
            name={card.data.name}
            title={card.data.title}
            sex={card.data.sex}
            dateOfBirth={card.data.dateOfBirth}
            text1={card.data.text1}
            text2={card.data.text2}
            text3={card.data.text3}
          />
        )}

        {card?.type === CONSERVATION_CARD_TYPE && (
          <ConservationCard
            className={style.card}
            tag={card.tag}
            status={card.data.status}
            title={card.data.title}
            text={card.data.text}
            btnLabel={card.data.btnLabel}
            btnLink={card.data.btnLink}
          />
        )}

        {card?.type === TWO_VIDEOS_CARD_TYPE && (
          <TwoVideosCard
            className={style.card}
            tag={card.tag}
            video1Url={card.data.video1Url}
            video2Url={card.data.video2Url}
            text1={card.data.text1}
            text2={card.data.text2}
            onPlay={onVideoPlayStarted}
            onStop={onVideoPlayStopped}
          />
        )}

        {card?.type === SINGLE_VIDEO_CARD_TYPE && (
          <SingleVideoCard
            className={classnames(style.card, style.video)}
            tag={card.tag}
            videoUrl={card.data.videoUrl}
            title={card.data.title}
            text={card.data.text}
            onPlay={onVideoPlayStarted}
            onStop={onVideoPlayStopped}
          />
        )}

        {card?.type === ORIGIN_AND_HABITAT_CARD_TYPE && (
          <OriginAndHabitatCard
            className={style.card}
            tag={card.tag}
            title={card.data.title}
            img={card.data.img}
            text={card.data.text}
          />
        )}

        {card?.type === ANIMAL_BODY_CARD_TYPE && (
          <AnimalBodyCard
            className={style.card}
            tag={card.tag}
            img={card.data.img}
            parts={card.data.parts}
          />
        )}

        {card?.type === QUIZ_CARD_TYPE && (
          <QuizCard
            className={classnames(style.card, style.quiz)}
            cardId={card._id}
            questions={card.data.questions}
            answers={card.data.answers}
            correctAnswers={card.data.correctAnswers}
          />
        )}
      </div>
    </Layer>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: { _id: habitatId },
      cards: {
        loading,
        items: cards,
        mobile: {
          activeMobileCardsTab,
          activeCardIndex,
        },
      },
    },
  }) => ({
    habitatId,
    loading,
    cards,
    activeMobileCardsTab,
    activeCardIndex,
  }),
  {
    closeAction: closeModalCards,
    openModalCardsAction: openModalCards,
    setLoadingAction: setLoading,
    setCardsAction: setCards,
    nextCardAction: nextCard,
    prevCardAction: prevCard,
    resetCardIndAction: resetCardInd,
  },
)(MobileCardsModal);
