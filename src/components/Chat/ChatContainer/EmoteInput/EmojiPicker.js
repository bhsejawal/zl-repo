import { h } from 'preact';
import { Picker } from 'emoji-mart';

const EmojiPicker = ({ addEmoji }) => (
  <Picker
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
);

export default EmojiPicker
