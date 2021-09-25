import { h } from 'preact';
import { connect } from 'react-redux';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'preact/hooks';
import { throttle } from 'lodash-es';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';

import Loader from 'Components/Loader';
import Can from 'Components/Authorize';
import ViewersCount from 'Components/ViewersCount/standalone';
import Shortcuts from '../shortcuts';
import CardEditor from '../CardEditor';
// eslint-disable-next-line
import CreateCardButton from 'async!./components/CreateCardButton';

import SingleIconCard from './SingleIconCard';
import ThreeIconsCard from './ThreeIconsCard';
import FourIconsCard from './FourIconsCard';
import AnimalProfileCard from './AnimalProfileCard';
import ConservationCard from './ConservationCard';
import TwoVideosCard from './TwoVideosCard';
import SingleVideoCard from './SingleVideoCard';
import OriginAndHabitatCard from './OriginAndHabitatCard';
import AnimalBodyCard from './AnimalBodyCard';
import QuizCard from './QuizCard';

import { setActiveShortcut, setCards, setLoading } from '../actions';
import { fetchCards } from '../api';
import { useIsInitiallyLoaded } from '../../../../../hooks';

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
} from '../constants';

import style from './style.scss';

const Cards = ({
  loading,
  cards = [],
  activeTab,
  habitatId,
  setCardsAction,
  setLoadingAction,
  setActiveShortcutAction,
}) => {
  const cardsRef = useRef();
  const tagPositionsRef = useRef();
  // this is used for smooth scroll to disable shortcut update
  const autoScrollingRef = useRef();
  const loaded = useIsInitiallyLoaded(loading);
  const { get } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const availableShortcuts = useMemo(
    // non empty tags
    () => Array.from(new Set(cards.map(({ tag }) => tag)))
      .filter((shortcut) => shortcut),
    [cards],
  );

  useEffect(() => {
    let prevTag;
    tagPositionsRef.current = [];
    const nodes = cardsRef.current.childNodes;

    const timeout = setTimeout(() => {
      cards.forEach(({ tag }, ind) => {
        if (tag !== prevTag) {
          prevTag = tag;
          tagPositionsRef.current.push({
            tag,
            pos: nodes[ind]?.offsetLeft,
          });
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [cards]);

  const onCardsScroll = useMemo(() => throttle((evt) => {
    if (!autoScrollingRef.current) {
      const scrolledFromLeft = evt.target.scrollLeft;
      const tagObj = tagPositionsRef.current
        .find(({ pos }) => pos > scrolledFromLeft);
      setActiveShortcutAction(tagObj?.tag);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 300, { trailing: true, leading: false }), [cards]);

  useEffect(() => {
    if (loading) {
      setActiveShortcutAction(null);
    } else {
      // find the first that has tag and use that value
      setActiveShortcutAction(cards.find(({ tag }) => tag)?.tag);
    }
  }, [activeTab, loading, cards, setActiveShortcutAction]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingAction(true);
        const { cards: newCards } = await fetchCards(habitatId, activeTab);

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

    if (habitatId) {
      load();
    }
  }, [activeTab, get, habitatId, setCardsAction, setLoadingAction]);

  const onShortcutClick = useCallback(({ target }) => {
    const { value } = target.dataset;
    setActiveShortcutAction(value);
    const selector = `[data-tag="${value}"]`;
    const firstChild = cardsRef.current?.querySelectorAll(selector)?.[0];
    firstChild.scrollIntoView({ behavior: 'smooth', inline: 'center' });

    autoScrollingRef.current = true;
    setTimeout(() => {
      autoScrollingRef.current = false;
    }, 1000);
  }, [setActiveShortcutAction]);

  return (
    <>
      <div className={style.cards} onScroll={onCardsScroll}>
        <div ref={cardsRef}>
          {!loaded && (
            <Loader fill />
          )}

          {loaded && (
            cards.map((card) => (
              <CardEditor card={card}>
                <ViewersCount viewers={card.views} plain className={style.viewersCount} />
                {card.type === SINGLE_ICON_CARD_TYPE && (
                  <SingleIconCard
                    tag={card.tag}
                    title={card.data.title}
                    img={card.data.img}
                    text={card.data.text}
                  />
                )}

                {card.type === THREE_ICONS_CARD_TYPE && (
                  <ThreeIconsCard
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

                {card.type === FOUR_ICONS_CARD_TYPE && (
                  <FourIconsCard
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

                {card.type === ANIMAL_PROFILE_CARD_TYPE && (
                  <AnimalProfileCard
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

                {card.type === CONSERVATION_CARD_TYPE && (
                  <ConservationCard
                    tag={card.tag}
                    status={card.data.status}
                    title={card.data.title}
                    text={card.data.text}
                    btnLabel={card.data.btnLabel}
                    btnLink={card.data.btnLink}
                  />
                )}

                {card.type === TWO_VIDEOS_CARD_TYPE && (
                  <TwoVideosCard
                    tag={card.tag}
                    video1Url={card.data.video1Url}
                    video2Url={card.data.video2Url}
                    text1={card.data.text1}
                    text2={card.data.text2}
                  />
                )}

                {card.type === SINGLE_VIDEO_CARD_TYPE && (
                  <SingleVideoCard
                    tag={card.tag}
                    videoUrl={card.data.videoUrl}
                    title={card.data.title}
                    text={card.data.text}
                  />
                )}

                {card.type === ORIGIN_AND_HABITAT_CARD_TYPE && (
                  <OriginAndHabitatCard
                    tag={card.tag}
                    title={card.data.title}
                    img={card.data.img}
                    text={card.data.text}
                  />
                )}

                {card.type === ANIMAL_BODY_CARD_TYPE && (
                  <AnimalBodyCard
                    tag={card.tag}
                    img={card.data.img}
                    parts={card.data.parts}
                  />
                )}

                {card.type === QUIZ_CARD_TYPE && (
                  <QuizCard
                    cardId={card._id}
                    questions={card.data.questions}
                    answers={card.data.answers}
                    correctAnswers={card.data.correctAnswers}
                  />
                )}
              </CardEditor>
            ))
          )}

          {/* this span is a hack for async-loader */}
          {/* seems like there's a bug, and async loader component can't find previous sibling */}
          <span />

          {loaded && (
            <Can
              perform="habitat:edit-cards"
              yes={() => (<CreateCardButton />)}
            />
          )}
        </div>
      </div>

      <Shortcuts available={availableShortcuts} onClick={onShortcutClick} />
    </>
  );
};

export default connect(
  ({
    habitat: {
      cards: {
        loading,
        items: cards,
        activeTab,
      },
      habitatInfo: {
        _id: habitatId,
      },
    },
  }) => ({
    loading,
    cards,
    activeTab,
    habitatId,
  }),
  {
    setCardsAction: setCards,
    setLoadingAction: setLoading,
    setActiveShortcutAction: setActiveShortcut,
  },
)(Cards);
