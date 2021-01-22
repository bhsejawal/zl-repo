import { useState, useCallback, useRef } from 'preact/hooks';
import { Picker as EmojiPicker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmileWink } from '@fortawesome/pro-light-svg-icons';

import { useOnClickOutside } from '../../../../hooks';

import style from './style.module.scss';

const EmojiInput = ({ value, onSelection }) => {
  const [showDropdown, setDropdownState] = useState(false);
  const dropdown = useRef(null);

  const dismissDropdown = useCallback(() => {
    setDropdownState(false);
  }, [setDropdownState]);

  useOnClickOutside(dropdown, dismissDropdown);

  const toggleDropdown = useCallback(() => {
    setDropdownState(!showDropdown);
  }, [setDropdownState, showDropdown]);

  const addEmoji = useCallback((emoji) => {
    if ('native' in emoji) {
      onSelection(`${value}${emoji.native}`);
      toggleDropdown();
    }
  }, [onSelection, toggleDropdown, value]);

  return (
    <div ref={dropdown} className={style.EmoteButton}>
      <FontAwesomeIcon icon={faSmileWink} onClick={toggleDropdown} />
      {showDropdown && (
        <div className={style.EmoteContainer}>
          <EmojiPicker
            title=""
            emoji=""
            native
            onSelect={addEmoji}
            onClick={addEmoji}
            autoFocus
            showPreview={false}
            showSkinTones={false}
            perLine={7}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiInput;
