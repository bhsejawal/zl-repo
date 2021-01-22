import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import {
  Layer,
  Box,
  Button,
  Text,
  Form,
  FormField,
  TextArea,
} from 'grommet';

const TEXT_INPUT = 'text'

const EditModal = ({
  initialText,
  postToUrl,
  textProp,
  minLen,
  maxLen,
  onClose,
  onUpdate,
}) => {
  const [value, setValue] = useState({ text: initialText });

  const error = useMemo(() => {
    if (value.text.length < minLen) {
      return `Minimum for this field is ${minLen} characters`;
    }
    if (value.text.length > maxLen) {
      return `Maximum for this field is ${maxLen} characters`;
    }
    return undefined;
  }, [value.text, minLen, maxLen]);

  const onSubmit = (evt) => {
    evt.preventDefault();

    if (error) {
      return;
    }

    const formData = new FormData(evt.target);
    const data = { [textProp]: formData.get(TEXT_INPUT) };
    console.log(postToUrl, data);
    // TODO: post data to the server
    onClose();
    onUpdate(value.text);
  };

  const onChange = (nextVal) => {
    setValue(nextVal);
  }

  return (
    <Layer position="center" onClickOutside={onClose}>
      <Box fill style={{ minWidth: '378px' }}>
        <Form value={value} onSubmit={onSubmit} onChange={onChange}>
          <Box
            direction="row"
            align="center"
            as="header"
            elevation="small"
            justify="between"
          >
            <Text margin={{ left: 'small' }}>Edit Text</Text>
            <Button onClick={onClose} icon={<FontAwesomeIcon icon={faTimes} />} />
          </Box>

          <Box flex overflow="auto" pad="xsmall">
            <FormField name="text">
              <TextArea name="text" type="text" />
            </FormField>

            {error && (
              <Box pad={{ horizontal: 'small' }}>
                <Text color="status-error">{error}</Text>
              </Box>
            )}
          </Box>

          <Box
            as="footer"
            border={{ side: 'top' }}
            pad="small"
            justify="center"
            direction="row"
            align="center"
          >
            <Button type="submit" primary label="Save" />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default EditModal;
