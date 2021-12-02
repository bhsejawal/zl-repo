import { Button, Tip, Box } from 'grommet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink } from '@fortawesome/pro-solid-svg-icons';

import RoundButton from 'Components/RoundButton';
import TipContent from 'Components/Tooltip';

import { getDesktopOrMobile } from '../../../../../helpers';

import style from './style.scss';

const EmojiButton = ({ plain, onClick}) => {
  const device = getDesktopOrMobile();
  return (
    <div>
      {plain && (
        <Button plain onClick={onClick}>
          <FontAwesomeIcon color="#fff" size="lg" icon={faGrinWink} />
        </Button>
      )}
      {!plain && (device === 'mobile' ? (
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
      ))}
    </div>
  );
}

export default EmojiButton;
