import { Button } from 'grommet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink } from '@fortawesome/pro-solid-svg-icons';

import RoundButton from 'Components/RoundButton';

import style from './style.scss';

const EmojiButton = ({ plain, onClick }) => (
  <div>
    {plain ? (
      <Button plain onClick={onClick}>
        <FontAwesomeIcon color="#fff" size="lg" icon={faGrinWink} />
      </Button>
    ) : (
      <RoundButton
        onClick={onClick}
        className={style.emojiButton}
        width="36"
        backgroundColor="var(--purple)"
        color="white"
      >
        <FontAwesomeIcon icon={faGrinWink} />
      </RoundButton>
    )}
  </div>
);

export default EmojiButton;
