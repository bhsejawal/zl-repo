import { h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import {
  Layer,
  Box,
  Form,
  Text,
  Button,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import ImageSelector from '../../../ImageSelector';

import style from './style.scss';

const IMAGE_FORM_NAME = 'image';

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

    const formData = new FormData(evt.target);
    const data = { [imageProp]: formData.get(IMAGE_FORM_NAME) };
    console.log(postToUrl, data);
    // TODO: post data to the server
    onClose();
    onUpdate(value);
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
            <Text margin={{ left: 'small' }}>Edit Image</Text>
            <Button onClick={onClose} icon={<FontAwesomeIcon icon={faTimes} />} />
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
            <Button type="submit" primary label="Save" />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default EditModal;
