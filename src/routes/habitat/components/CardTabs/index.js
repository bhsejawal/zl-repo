import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

import {
  ANIMAL_PROFILE_CARD_TYPE,
  CONSERVATION_CARD_TYPE,
  FOUR_ICONS_CARD_TYPE,
  ORIGIN_AND_HABITAT_CARD_TYPE,
  QUICK_LOOK,
  SINGLE_ICON_CARD_TYPE,
  SINGLE_VIDEO_CARD_TYPE,
  THREE_ICONS_CARD_TYPE,
  TWO_VIDEOS_CARD_TYPE,
} from './constants';
import { setActiveTab, setCards } from './actions';
import { fetchCards } from './api';

import Can from '../../../../components/Authorize';

import Tabs from './tabs';
import Shortcuts from './shortcuts';
import CardEditor from './CardEditor';
// eslint-disable-next-line
import CreateCardButton from 'async!./cards/components/CreateCardButton';

import SingleIconCard from './cards/SingleIconCard';
import ThreeIconsCard from './cards/ThreeIconsCard';
import FourIconsCard from './cards/FourIconsCard';
import AnimalProfileCard from './cards/AnimalProfileCard';
import ConservationCard from './cards/ConservationCard';
import TwoVideosCard from './cards/TwoVideosCard';
import SingleVideoCard from './cards/SingleVideoCard';
import OriginAndHabitatCard from './cards/OriginAndHabitatCard';

import style from './style.scss';

const CardTabs = ({
  cards = [],
  activeTab,
  setCardsAction,
  setActiveTabAction,
}) => {
  const [activeShortcut, setActiveShortcut] = useState(QUICK_LOOK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { cards: newCards } = await fetchCards('mockCamID', activeTab);
        setCardsAction(newCards);
      } catch (err) {
        // TODO: implement error UI
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTab, setCardsAction]);

  const onTabClick = useCallback(({ target }) => {
    setActiveTabAction(target.dataset.value);
  }, [setActiveTabAction]);

  const onShortcutClick = useCallback(({ target }) => {
    setActiveShortcut(target.dataset.value);
  }, [setActiveShortcut]);

  return (
    <div>
      <Tabs active={activeTab} onClick={onTabClick} />

      <div className={style.cards}>
        <div>
          {loading && (
            <div className={style.loading}>
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </div>
          )}

          {!loading && (
            cards.map((card) => (
              <CardEditor card={card}>
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
              </CardEditor>
            ))
          )}

          {/* this span is a hack for async-loader */}
          {/* seems like there's a bug, and async loader component can't find previous sibling */}
          <span />

          {!loading && (
            <Can
              perform="habitat:edit-cards"
              yes={() => (<CreateCardButton />)}
            />
          )}
        </div>
      </div>

      <Shortcuts active={activeShortcut} onClick={onShortcutClick} />
    </div>
  );
};

export default connect(
  ({
    habitat: {
      cards: {
        items: cards,
        activeTab,
      },
    },
  }) => ({
    cards,
    activeTab,
  }),
  {
    setCardsAction: setCards,
    setActiveTabAction: setActiveTab,
  },
)(CardTabs);
