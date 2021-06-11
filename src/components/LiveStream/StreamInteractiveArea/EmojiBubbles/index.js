import {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { flatten, random } from 'lodash-es';

import { GlobalsContext } from 'Shared/context';
import { EMOJI_ANIMATION_TIME } from 'Components/LiveStream/constants';

import style from './style.scss';

const ADD = 'ADD';
const REMOVE = 'REMOVE';

const reducer = (emojis, { type, payload }) => {
  switch (type) {
    case ADD: {
      const { userId, path } = payload;
      return [...emojis, { userId, path, leftPos: `${random(5, 85)}%` }];
    }
    case REMOVE: {
      const { userId, path } = payload;
      return emojis.filter((ct) => ct.userId !== userId || ct.path !== path);
    }
    default: {
      return emojis;
    }
  }
};

const EmojiBubbles = ({ emojiDrops }) => {
  const { socket } = useContext(GlobalsContext);
  const [emojis, dispatch] = useReducer(reducer, []);
  const removeTimeoutRef = useRef();

  const emojiItems = useMemo(
    () => flatten(emojiDrops.map(({ items }) => items).filter((item) => !!item)),
    [emojiDrops],
  );

  useEffect(() => {
    const onEmoji = ({ userId, path }) => {
      // this is just a security check to
      // prevent malicious users from posting custom URLs
      if (!emojiItems.includes(path)) {
        return;
      }

      const payload = { userId, path };
      dispatch({ type: ADD, payload });
      removeTimeoutRef.current = setTimeout(
        () => dispatch({ type: REMOVE, payload }),
        EMOJI_ANIMATION_TIME,
      );
    };

    socket.on('emoji_bubble', onEmoji);
    return () => {
      socket.off('emoji_bubble', onEmoji);
      clearTimeout(removeTimeoutRef.current);
    };
  }, [socket, emojiItems]);

  return (
    <div className={style.wrapper}>
      {emojis.map(({ userId, path, leftPos }) => (
        <div key={`${path}-${userId}`} className={style.emoji} style={{ left: leftPos }}>
          <img src={path} alt="emoji" />
        </div>
      ))}
    </div>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: { emojiDrops = [] },
    },
  }) => ({
    emojiDrops,
  }),
)(EmojiBubbles);
