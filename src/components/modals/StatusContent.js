import { h } from 'preact';
import {
  Box,
  Button,
  Heading,
  Text,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faTimesCircle } from '@fortawesome/pro-regular-svg-icons';

const StatusContent = ({ type = 'success', text, onClose }) => (
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
        onClick={onClose}
        icon={<FontAwesomeIcon size="lg" color="--var(grey)" icon={faTimes} />}
        style={{ minWidth: 'unset' }}
      />
    </Box>

    <Box
      justify="center"
      align="center"
      pad={{ vertical: '0', horizontal: 'large' }}
    >
      {type === 'success' && (
        <>
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="8x"
            color="var(--hunterGreenMediumLight)"
          />
          <Heading level="3">Success!</Heading>
        </>
      )}
      {type === 'error' && (
        <>
          <FontAwesomeIcon
            icon={faTimesCircle}
            size="8x"
            color="var(--red)"
          />
          <Heading level="3">Uh oh!</Heading>
        </>
      )}

      <Text textAlign="center" size="large">{text}</Text>

      <Box width={{ min: '140px' }} margin={{ vertical: 'large' }}>
        <Button primary size="large" label="Okay" onClick={onClose} />
      </Box>
    </Box>
  </Box>
);

export default StatusContent;
