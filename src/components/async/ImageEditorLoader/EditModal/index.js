import { h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import {
  Layer,
  Box,
  Form,
  Heading,
  Button,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import ImageSelector from '../../../ImageSelector';

import style from './style.scss';

const EditModal = ({
  initialImgUrl,
  postToUrl,
  imageProp,
  constraints,
  onClose,
  onUpdate,
}) => {
  const imgSelectorRef = useRef();
  const previewRef = useRef();
  const [value, setValue] = useState(initialImgUrl);

  const {
    loading,
    // TODO: display error somewhere when we have UI designs
    // eslint-disable-next-line no-unused-vars
    error,
    response,
    patch,
  } = useFetch(
    buildURL(postToUrl),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const isValid = await imgSelectorRef.current.validate();
      if (!isValid) {
        return
      }
    } catch (err) {
      console.error(err);
      return;
    }

    await patch({ [imageProp]: value });

    if (response.ok) {
      onClose();
      onUpdate(value);
    }
  };

  const onBlur = useCallback(({ target }) => {
    setValue(target.value);
  }, []);

  const onChange = useCallback((newVal) => {
    setValue(newVal);
  }, []);

  return (
    <Layer position="center" onClickOutside={onClose}>
      <Box fill style={{ minWidth: '378px' }}>
        <Form onSubmit={onSubmit}>
          <Box
            direction="row"
            align="center"
            as="header"
            elevation="small"
            justify="between"
          >
            <Heading level="2" margin={{ vertical: 'medium', horizontal: 'large' }}>
              Edit Image
            </Heading>
            <Button
              plain
              margin="medium"
              onClick={onClose}
              icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
            />
          </Box>

          <Box flex overflow="auto" pad="xsmall">
            <Box fill align="stretch" direction="row">
              <Box justify="center" align="center" width="400px" height="400px" pad="medium">
                <img ref={previewRef} className={style.previewImg} src={value} alt="Preview" />
              </Box>

              <Box justify="center" pad="medium">
                <ImageSelector
                  required
                  ref={imgSelectorRef}
                  previewRef={previewRef}
                  url={value}
                  label="Image URL"
                  constraints={constraints}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </Box>
            </Box>
          </Box>

          <Box
            as="footer"
            border={{ side: 'top' }}
            pad="small"
            justify="center"
            direction="row"
            align="center"
          >
            <PrimaryButton loading={loading} type="submit" label="Save" />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default EditModal;
