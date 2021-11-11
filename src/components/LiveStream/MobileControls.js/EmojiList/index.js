import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { flatten } from 'lodash-es';
import { Box, Button } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { GlobalsContext } from 'Shared/context';
import { EMOJI_ANIMATION_TIME } from 'Components/LiveStream/constants';

import style from './style.scss';

const EmojiList = ({
  userId,
  habitatId,
  cameraId,
  emojis,
  onClose,
}) => {
  const { socket } = useContext(GlobalsContext);
  const [disabled, setDisabled] = useState();
  const disabledTimeoutRef = useRef();

  const emojiItems = useMemo(
    () => flatten(emojis.map(({ items }) => items).filter((item) => !!item)),
    [emojis],
  );

  const onEmojiClick = (path) => {
    socket.emit('userDroppedBubbleEmoji', {
      userId,
      habitatId,
      cameraId,
      path,
    });

    setDisabled(true);
    disabledTimeoutRef.current = setTimeout(
      () => setDisabled(false),
      EMOJI_ANIMATION_TIME,
    );
  };

  useEffect(() => () => clearTimeout(disabledTimeoutRef.current), []);

  return (
    <Box
      round="large"
      flex="shrink"
      background="#fff"
      direction="row"
      align="stretch"
      overflow="hidden"
    >
      <Box
        flex
        direction="row"
        overflow="auto"
        gap="medium"
        pad={{ horizontal: 'medium' }}
      >
        {emojiItems.map((url) => (
          <Button
            plain
            disabled={disabled}
            key={url}
            className={style.emojiBtn}
            onClick={() => onEmojiClick(url)}
          >
            <img src={url} className={style.emojiImg} alt="" />
          </Button>
        ))}
      </Box>

      <Box fill="vertical" pad="10px" elevation="xsmall">
        <Button onClick={onClose}>
          <FontAwesomeIcon color="var(--mediumGrey)" icon={faTimes} />
        </Button>
      </Box>
    </Box>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: { _id: habitatId, emojiDrops: emojis = [], camera: { _id: cameraId } },
    },
    user: { userId },
  }) => ({
    emojis,
    userId,
    habitatId,
    cameraId,
  }),
)(EmojiList);
