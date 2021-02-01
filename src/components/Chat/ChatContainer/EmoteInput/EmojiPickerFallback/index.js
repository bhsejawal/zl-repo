import { h } from 'preact';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './style.scss';

const EmojiPickerFallback = () => (
  <div className={style.fallback}>
    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
  </div>
);

export default EmojiPickerFallback;
