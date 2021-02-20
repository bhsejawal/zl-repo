import classnames from 'classnames';

import EmojiBasket from './EmojiBasket';
import EmojiButton from './EmojiButton';
import ZoomBar from './ZoomBar';
import TakeSnapshotButton from './TakeSnapshotButton';

import style from './style.scss';

const StreamControls = ({ position = 'left' }) => (
  <div className={classnames(style.streamControlsWrapper, style[position])}>
    <div className={style.streamControls}>
      <ZoomBar />
      <TakeSnapshotButton />
      <EmojiButton />
      <EmojiBasket />
    </div>
  </div>
);

export default StreamControls;
