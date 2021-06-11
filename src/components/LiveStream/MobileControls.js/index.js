import { useState, useCallback } from 'preact/hooks';
import { Box } from 'grommet';
import { MOBILE_CONTROLS_HEIGHT } from '../../../routes/habitat/constants';
import EmojiButton from '../StreamInteractiveArea/StreamControls/EmojiButton';

import TakeSnapshotButton from '../StreamInteractiveArea/StreamControls/TakeSnapshotButton';
import ZoomBar from '../StreamInteractiveArea/StreamControls/ZoomBar';
import EmojiList from './EmojiList';

const MobileControls = () => {
  const [emojiListVisible, setEmojiListVisible] = useState();

  const toggleEmoji = useCallback(
    () => setEmojiListVisible(!emojiListVisible),
    [emojiListVisible],
  );

  return (
    <Box
      width="100%"
      height={`${MOBILE_CONTROLS_HEIGHT}px`}
      direction="row"
      align="center"
      justify="around"
      background="var(--hunterGreenMediumLight)"
      pad={{ horizontal: "medium" }}
    >
      <Box gap="large" justify="center" direction="row" margin={{ right: '20px' }}>
        <EmojiButton plain onClick={toggleEmoji} />
        {!emojiListVisible && <TakeSnapshotButton plain />}
      </Box>
      <Box flex>
        {emojiListVisible
          ? <EmojiList onClose={toggleEmoji} />
          : <ZoomBar horizontal />}
      </Box>
    </Box>
  );
};

export default MobileControls;
