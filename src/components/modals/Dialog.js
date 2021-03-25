import { h } from 'preact';

import {
  Layer,
  Box,
  Button,
  Heading,
  Text,
} from 'grommet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

const DialogModal = ({
  title,
  text,
  buttonLabel,
  onCancel,
  onConfirm,
}) => (
  <Layer position="center" onClickOutside={onCancel} onEsc={onCancel}>
    <Box width="400px">
      <Box
        direction="row"
        align="center"
        as="header"
        justify="end"
        overflow="hidden"
      >
        <Button
          plain
          margin="small"
          onClick={onCancel}
          icon={<FontAwesomeIcon size="lg" color="--var(grey)" icon={faTimes} />}
        />
      </Box>
      <Box
        justify="center"
        align="center"
        pad={{ vertical: '0', horizontal: 'large' }}
      >
        <Heading level="3">{title}</Heading>
        <Text textAlign="center" size="large">{text}</Text>

        <Box width={{ min: '140px' }} margin={{ vertical: 'large' }}>
          <Button primary size="large" label={buttonLabel} onClick={onConfirm} />
        </Box>
      </Box>
    </Box>
  </Layer>
);

export default DialogModal;
