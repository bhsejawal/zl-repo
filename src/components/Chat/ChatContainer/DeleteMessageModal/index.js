import { h } from 'preact';
import { Box, Heading, Layer } from 'grommet';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import Header from 'Components/modals/Header';
import Body from 'Components/modals/Body';

const DeleteModal = ({ onDelete, onClose }) => (
  <Layer onEsc={onClose} onClickOutside={onClose}>
    <Header onClose={onClose}>
      Delete Message
    </Header>
    <Body>
      <Box>
        <Heading level="4">
          Are you sure you want to delete this message?
        </Heading>
      </Box>
      <Box align="end" direction="row" justify="between">
        <OutlineButton
          label="Cancel"
          onClick={onClose}
        />
        &nbsp;
        &nbsp;
        <PrimaryButton
          label="Delete"
          onClick={onDelete}
        />
      </Box>
    </Body>
  </Layer>
);

export default DeleteModal;
