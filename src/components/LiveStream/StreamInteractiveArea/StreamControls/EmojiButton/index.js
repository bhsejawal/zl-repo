import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink } from '@fortawesome/pro-solid-svg-icons';

import { toggleShowEmojiBasket } from '../../../../../redux/actions';

import RoundButton from '../../../../RoundButton';

import style from './style.scss';

const EmojiButton = ({ toggleShowEmojiBasketAction }) => (
  <RoundButton
    onClick={toggleShowEmojiBasketAction}
    className={style.emojiButton}
    width="35"
    backgroundColor="#fc639b"
    color="white"
  >
    <FontAwesomeIcon icon={faGrinWink} />
  </RoundButton>
);

export default connect(null, {
  toggleShowEmojiBasketAction: toggleShowEmojiBasket,
})(EmojiButton);
