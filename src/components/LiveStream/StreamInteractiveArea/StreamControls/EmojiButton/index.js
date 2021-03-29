import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink } from '@fortawesome/pro-solid-svg-icons';

import RoundButton from 'Components/RoundButton';

import { toggleShowEmojiBasket } from '../../../../../redux/actions';

import style from './style.scss';

const EmojiButton = ({ toggleShowEmojiBasketAction }) => (
  <RoundButton
    onClick={toggleShowEmojiBasketAction}
    className={style.emojiButton}
    width="36"
    backgroundColor="var(--purple)"
    color="white"
  >
    <FontAwesomeIcon icon={faGrinWink} />
  </RoundButton>
);

export default connect(null, {
  toggleShowEmojiBasketAction: toggleShowEmojiBasket,
})(EmojiButton);
