import { h } from 'preact';
import { Layer, Box } from 'grommet';

import Header from 'Components/modals/Header';
import {
  EMOJI_SECTION,
  OVERLAY_SECTION,
  POWER_SECTION,
  CONFIGURATIONS,
} from '../constants';

import Power from './Power';
import EmojiDrop from './EmojiDrop';
import Overlay from './Overlay';
import Configuration from './Configuration';

const StreamEditModal = ({ section, onClose }) => (
  <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
    <Box height={{ max: 'calc((100 * var(--vh)) - 30px)'}}>
      <Header onClose={onClose}>
        {section === POWER_SECTION && 'Power'}
        {section === EMOJI_SECTION && 'Emoji Drop'}
        {section === OVERLAY_SECTION && 'Photo Overlay'}
        {section === CONFIGURATIONS && 'Configuration'}
      </Header>

      <Box height="100%">
        {section === POWER_SECTION && <Power />}
        {section === EMOJI_SECTION && <EmojiDrop />}
        {section === OVERLAY_SECTION && <Overlay />}
        {section === CONFIGURATIONS && <Configuration />}
      </Box>
    </Box>
  </Layer>
);

export default StreamEditModal;
