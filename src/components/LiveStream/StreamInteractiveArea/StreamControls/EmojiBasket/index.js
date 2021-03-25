import {
  useRef,
  useMemo,
  useState,
  useEffect,
} from 'preact/hooks';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { toggleShowEmojiBasket } from '../../../../../redux/actions';

import style from './style.scss';

export const EmojiBasketNoRedux = ({
  className,
  emojis,
  showEmojiBasket,
  tabIndex: tabIndexProp,
  toggleShowEmojiBasketAction,
}) => {
  const draggedElRef = useRef();
  const [basketInd, setBasketInd] = useState(0);

  const emojiItems = useMemo(
    () => (emojis[basketInd]?.items.filter((item) => !!item) || []),
    [basketInd, emojis],
  );

  useEffect(() => {
    if (typeof tabIndexProp === 'number') {
      setBasketInd(tabIndexProp);
    }
  }, [tabIndexProp]);

  const onDragStart = (evt) => {
    let { width, height } = evt.target.getBoundingClientRect();
    width *= 2;
    height *= 2;
    const wrapper = document.createElement('div');
    const elCopy = document.createElement('img');
    elCopy.src = evt.target.src;
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.classList.add(style.draggedEmoji);
    wrapper.append(elCopy);
    document.body.append(wrapper);
    evt.dataTransfer.setDragImage(wrapper, 20, 20);
    evt.dataTransfer.setData('text', evt.target.src);
    evt.dataTransfer.setData('type', 'emoji');
    draggedElRef.current = wrapper;
  };

  const onDragEnd = () => draggedElRef.current.remove();

  if (!showEmojiBasket || !emojis) {
    return null;
  }

  return (
    <div className={classnames(style.emojiContainer, className)}>
      <div className={style.emojiInner}>
        <div className={classnames(style.text, style.title)}>
          <span>Drag and drop on the screen.</span>
          {toggleShowEmojiBasketAction && (
            <button type="button" className={style.close} onClick={toggleShowEmojiBasketAction}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        <div className={classnames(style.itemsWrapper, style.customScrollBar)}>
          <div className={style.items}>
            {emojiItems.map((url) => (
              <div key={url}>
                <img
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  draggable="true"
                  src={encodeURI(url)}
                  alt="emoji"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {emojis.length > 1 && (
        <div className={style.emojiBasketTabs}>
          {emojis.map(({ icon }, ind) => (
            <button
              key={icon}
              type="button"
              className={classnames(style.tabButton, { active: ind === basketInd })}
              onClick={() => setBasketInd(ind)}
            >
              <img src={icon} alt={`tab ${ind + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default connect(({
  mainStream: { interactionState: { showEmojiBasket } },
  habitat: { habitatInfo: { emojiDrops: emojis = []}},
}) => ({ emojis, showEmojiBasket }), {
  toggleShowEmojiBasketAction: toggleShowEmojiBasket,
})(EmojiBasketNoRedux);
