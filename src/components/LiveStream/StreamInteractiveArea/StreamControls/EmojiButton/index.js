import { Button, Tip, Box } from 'grommet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink } from '@fortawesome/pro-solid-svg-icons';

import RoundButton from 'Components/RoundButton';
import TipContent from 'Components/Tooltip';

import style from './style.scss';

const EmojiButton = ({ plain, onClick }) => (
  <div>
    {plain ? (
      <Button plain onClick={onClick}>
        <FontAwesomeIcon color="#fff" size="lg" icon={faGrinWink} />
      </Button>
    ) : (
      <Tip
        dropProps={{ align: { left: 'right' } }}
        content={<TipContent message="Add Emoji Reactions" />}
        plain
      >
        <Box>
          <RoundButton
            onClick={onClick}
            className={style.emojiButton}
            width="36"
            backgroundColor="var(--purple)"
            color="white"
          >
            <FontAwesomeIcon icon={faGrinWink} />
          </RoundButton>
        </Box>
      </Tip>
    )}
  </div>
);

export default EmojiButton;
