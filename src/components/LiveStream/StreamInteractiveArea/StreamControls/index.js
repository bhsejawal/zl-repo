import { connect } from 'react-redux';
import classnames from 'classnames';

import EmojiBasket from './EmojiBasket';
import EmojiButton from './EmojiButton';
import ZoomBar from './ZoomBar';
import TakeSnapshotButton from './TakeSnapshotButton';
import RecordVideoButton from './RecordVideoButton';

import { toggleShowEmojiBasket } from '../../../../redux/actions';
import { isPhone } from '../../../../helpers';

import style from './style.scss';

const StreamControls = ({ position = 'left', toggleShowEmojiBasketAction, isFullscreen }) => (
  <div className={classnames(style.streamControlsWrapper, style[position])}>
    <div className={style.streamControls}>
      <ZoomBar />

      {(!isPhone() || !isFullscreen) && (
      <>
        <EmojiButton onClick={toggleShowEmojiBasketAction} />
        <EmojiBasket className={style.emojiContainer} />
        <TakeSnapshotButton />
        <RecordVideoButton />
      </>
      )}
    </div>
  </div>
)

export default connect(
  null,
  { toggleShowEmojiBasketAction: toggleShowEmojiBasket },
)(StreamControls);
