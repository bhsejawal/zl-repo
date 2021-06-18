import { h } from 'preact';
import {
  Box,
  Heading,
  Layer,
} from 'grommet';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import Header from 'Components/modals/Header';

const DeleteModal = ({ action, onConfirm, onClose }) => {
  const title = action === 'hide' ? 'Hide Content?' : 'Unhide Content?';
  const body = action === 'hide' ? (
    <>
      <Heading level="4" style={{ fontWeight: 400 }}>
        Are you sure you want to hide this from the public album?
      </Heading>
      <Heading level="4">
        All hidden content is automatically deleted within 24hrs
      </Heading>
    </>
  ) : (
    <Heading level="4" style={{ fontWeight: 400 }}>
      Are you sure you want to make this content public on the album?
    </Heading>
  );
  const buttonLabel = action === 'hide' ? 'Hide' : 'Unhide';

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Header onClose={onClose}>
        {title}
      </Header>
      <Box pad={{ vertical: 'medium', horizontal: 'large' }}>
        {body}
      </Box>

      <Box pad={{ vertical: 'medium', horizontal: 'large' }} align="end" direction="row" justify="between">
        <OutlineButton
          label="Cancel"
          onClick={onClose}
        />
        <PrimaryButton
          label={buttonLabel}
          onClick={onConfirm}
        />
      </Box>
    </Layer>
  );
};

export default DeleteModal;
