import { h } from 'preact';
import {
  Box,
  Button,
  Heading,
  Layer,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';

const DeleteModal = ({ onDelete, onClose }) => (
  <Layer onEsc={onClose} onClickOutside={onClose}>
    <Box
      direction="row"
      align="center"
      as="header"
      elevation="small"
      justify="end"
    >
      <Button
        plain
        margin="medium"
        onClick={onClose}
        icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
      />
    </Box>
    <Box pad={{ vertical: 'medium', horizontal: 'large' }}>
      <Heading level="4">
        Are you sure you want to delete this message?
      </Heading>
    </Box>

    <Box pad={{ vertical: 'medium', horizontal: 'large' }} align="end" direction="row" justify="between">
      <OutlineButton
        label="Cancel"
        onClick={onClose}
      />
      <PrimaryButton
        label="Delete"
        onClick={onDelete}
      />
    </Box>
  </Layer>
);

export default DeleteModal;
