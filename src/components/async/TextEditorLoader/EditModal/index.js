import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { PrimaryButton } from 'Components/Buttons';
import {
  Layer,
  Box,
  Text,
  Form,
  TextArea,
} from 'grommet';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import Header from 'Components/modals/Header';
import Body from 'Components/modals/Body';

import style from './style.scss';

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
  const {
    loading,
    // TODO: display error somewhere when we have UI designs
    // eslint-disable-next-line no-unused-vars
    error: requestError,
    response,
    patch,
  } = useFetch(
    buildURL(postToUrl),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const error = useMemo(() => {
    if (value?.text?.length < minLen) {
      return `Minimum for this field is ${minLen} characters`;
    }
    if (value?.text?.length > maxLen) {
      return `Maximum for this field is ${maxLen} characters`;
    }
    return undefined;
  }, [value.text, minLen, maxLen]);

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (error) {
      return;
    }

    const formData = new FormData(evt.target);
    await patch({ [textProp]: formData.get(TEXT_INPUT) });

    if (response.ok) {
      onClose();
      onUpdate(value.text);
    }
  };

  const onChange = (nextVal) => {
    setValue(nextVal);
  }

  return (
    <Layer position="center" onClickOutside={onClose}>
      <Box>
        <Header onClose={onClose}>
          Edit Text
        </Header>

        <Body>
          <Form value={value} onSubmit={onSubmit} onChange={onChange}>
            <Box flex overflow="auto">
              <Box margin={{ bottom: '20px' }}>
                <TextArea
                  type="text"
                  rows="5"
                  name={TEXT_INPUT}
                  className={style.textArea}
                />
              </Box>
              <Box justify="between" direction="row">
                {error && (
                  <Box pad={{ horizontal: 'small' }}>
                    <Text color="status-error">{error}</Text>
                  </Box>
                )}
                <Box margin={{ left: 'auto' }}>
                  <Text color={error ? 'status-error' : ''}>
                    {value.text?.length ?? 0}
                    /
                    {maxLen}
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box align="end" margin={{ top: '30px' }}>
              <PrimaryButton loading={loading} type="submit" label="Save" />
            </Box>
          </Form>
        </Body>
      </Box>
    </Layer>
  );
};

export default EditModal;
