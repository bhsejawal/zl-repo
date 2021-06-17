import { h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import {
  Layer,
  Box,
  Form,
} from 'grommet';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import Header from 'Components/modals/Header';
import Body from 'Components/modals/Body';
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
      <Box width={{ min: '378px' }}>
        <Header onClose={onClose}>
          Edit Image
        </Header>

        <Body>
          <Form onSubmit={onSubmit}>
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

            <Box align="end">
              <PrimaryButton loading={loading} type="submit" label="Save" />
            </Box>
          </Form>
        </Body>
      </Box>
    </Layer>
  );
};

export default EditModal;
