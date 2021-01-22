import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

import { QUICK_LOOK } from './constants';
import { setActiveTab, setCards } from './actions';
import { fetchCards } from './api';

import Tabs from './tabs';
import Shortcuts from './shortcuts';
import CardEditor from './CardEditor';
import Card1 from './cards/Card1';
// eslint-disable-next-line
import CreateCardButton from 'async!./cards/CreateCardButton';

import style from './style.scss';

const CardTabs = ({
  cards = [],
  activeTab,
  isAdmin,
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
                {card.type === 'type1' && (
                  <Card1
                    tag={card.tag}
                    img={card.data.img}
                    title={card.data.title}
                    text={card.data.text}
                  />
                )}
              </CardEditor>
            ))
          )}

          {/* this span is a hack for async-loader */}
          {/* seems like there's a bug, and async loader component can't find previous sibling */}
          <span />

          {!loading && isAdmin && <CreateCardButton />}
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
    isAdmin: true,
  }),
  {
    setCardsAction: setCards,
    setActiveTabAction: setActiveTab,
  },
)(CardTabs);
