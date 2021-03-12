import { h } from 'preact';
import {
  Layer,
  Box,
  Button,
  Heading,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { EMOJI_SECTION, OVERLAY_SECTION, POWER_SECTION } from '../constants';

import Power from './Power';
import EmojiDrop from './EmojiDrop';
import Overlay from './Overlay';

const StreamEditModal = ({ section, onClose }) => (
  <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
    <Box width={{ min: 'min(1200px, calc(100vw - 20px))' }} height="calc(100vh - 30px)">
      <Box
        direction="row"
        align="center"
        as="header"
        elevation="small"
        justify="between"
      >
        <Heading level="2" margin={{ vertical: 'medium', horizontal: 'large' }}>
          {section === POWER_SECTION && 'Power'}
          {section === EMOJI_SECTION && 'Emoji Drop'}
          {section === OVERLAY_SECTION && 'Photo Overlay'}
        </Heading>
        <Button
          plain
          margin="medium"
          onClick={onClose}
          icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
        />
      </Box>

      <Box height="100%">
        {section === POWER_SECTION && <Power />}
        {section === EMOJI_SECTION && <EmojiDrop />}
        {section === OVERLAY_SECTION && <Overlay />}
      </Box>
    </Box>
  </Layer>
);

export default StreamEditModal;
