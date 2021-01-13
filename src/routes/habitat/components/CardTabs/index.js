import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { MEET, INFO, QUICK_LOOK } from './constants';

import Tabs from './tabs';
import Shortcuts from './shortcuts';

import style from './style.scss';

// TODO: remove these mock tabs when we have server side implementation
const tabs = {
  [MEET]: ['tab1', 'tab2'],
  [INFO]: ['tab3'],
}

const CardTabs = () => {
  const [activeTab, setActiveTab] = useState(MEET);
  const [activeShortcut, setActiveShortcut] = useState(QUICK_LOOK);

  const onTabClick = useCallback(({ target }) => {
    setActiveTab(target.dataset.value);
  }, [setActiveTab]);

  const onShortcutClick = useCallback(({ target }) => {
    setActiveShortcut(target.dataset.value);
  }, [setActiveShortcut]);

  return (
    <div>
      <Tabs active={activeTab} onClick={onTabClick} />

      <div className={style.cards}>
        {/* NOTE: we'll probably completely change this */}
        {tabs[activeTab] && tabs[activeTab].map((tl) => (
          <div className={style.card}>{tl}</div>
        ))}
      </div>

      <Shortcuts active={activeShortcut} onClick={onShortcutClick} />
    </div>
  );
};

export default CardTabs;
