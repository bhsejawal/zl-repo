import { h } from 'preact';
import {
  Box,
  Heading,
  Layer,
  Button,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import Body from 'Components/modals/Body';

import style from './style.scss';

const DeleteModal = ({ onDelete, onClose }) => (
  <Layer onEsc={onClose} onClickOutside={onClose}>
    <Box
      direction="row"
      align="center"
      as="header"
      elevation="small"
      justify="center"
    >
      <Heading level="4">
        Report this question
      </Heading>

      <Button
        plain
        margin="medium"
        onClick={onClose}
        icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
        justifySelf="end"
        className={style.button}
      />
    </Box>
    <Body>
      <Box>
        <Heading level="4">
          Are you sure you want to delete this question?
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
