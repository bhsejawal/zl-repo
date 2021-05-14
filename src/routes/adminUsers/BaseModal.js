import { h } from 'preact';
import { useState } from 'preact/hooks';
import {
  Box,
  Button,
  Heading,
  Layer,
  Text,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PrimaryButton } from 'Components/Buttons';
import StatusModalContent from 'Components/modals/StatusContent';
import { defaultErrorMsg } from 'Components/modals/Error';

import { faTimes } from '@fortawesome/pro-solid-svg-icons';

const BaseModal = ({
  heading,
  text,
  buttonText,
  onClose,
  onConfirm,
}) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layer position="center" onEsc={onClose} onClickOutside={onClose}>
      {error && (
        <StatusModalContent
          type="error"
          text={defaultErrorMsg}
          onClose={() => setError(false)}
        />
      )}

      {!error && (
        <Box width="360px">
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
            />
          </Box>

          <Box pad={{ vertical: '0', horizontal: 'large' }}>
            <Heading textAlign="center" margin="small" level="3">
              {heading}
            </Heading>

            <Text textAlign="center" size="large">
              {text}
            </Text>

            <Box
              alignSelf="center"
              pad={{ top: 'medium', bottom: 'large' }}
              width={{ min: '140px' }}
            >
              <PrimaryButton
                label={buttonText}
                loading={loading}
                onClick={handleConfirm}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Layer>
  );
};

export default BaseModal;
