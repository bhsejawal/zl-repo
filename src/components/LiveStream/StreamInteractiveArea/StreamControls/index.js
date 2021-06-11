import { connect } from 'react-redux';
import classnames from 'classnames';

import EmojiBasket from './EmojiBasket';
import EmojiButton from './EmojiButton';
import ZoomBar from './ZoomBar';
import TakeSnapshotButton from './TakeSnapshotButton';
import { toggleShowEmojiBasket } from '../../../../redux/actions';

import style from './style.scss';

const StreamControls = ({ position = 'left', toggleShowEmojiBasketAction }) => (
  <div className={classnames(style.streamControlsWrapper, style[position])}>
    <div className={style.streamControls}>
      <ZoomBar />
      <TakeSnapshotButton />
      <EmojiButton onClick={toggleShowEmojiBasketAction} />
      <EmojiBasket className={style.emojiContainer} />
    </div>
  </div>
);

export default connect(
  null,
  { toggleShowEmojiBasketAction: toggleShowEmojiBasket },
)(StreamControls);
