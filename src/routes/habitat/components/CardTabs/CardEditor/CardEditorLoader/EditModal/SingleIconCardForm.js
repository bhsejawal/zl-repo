import { h } from 'preact';
import { forwardRef, useImperativeHandle } from 'preact/compat';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
import {
  Box,
  Text,
  Heading,
  TextArea,
} from 'grommet';

import ImageSelector from 'Components/ImageSelector';

import style from './style.scss';

const SingleIconCardForm = forwardRef(({
  title,
  text,
  img,
  onInputChange,
  onDataChange,
}, ref) => {
  const imgSelectorRef = useRef();
  const [titleErrorMsg, setTitleErrorMsg] = useState();
  const [textErrorMsg, setTextErrorMsg] = useState();

  useImperativeHandle(ref, () => ({
    validate: async () => {
      let isValid = true;

      if (!title || title.length === 0) {
        setTitleErrorMsg('Title is required');
        isValid = false;
      }

      if (!text || text.length === 0) {
        setTextErrorMsg('Text is required');
        isValid = false;
      }

      const isImgValid = await imgSelectorRef.current.validate();
      return isValid && isImgValid;
    },
  }));

  useEffect(() => setTitleErrorMsg(undefined), [title]);
  useEffect(() => setTextErrorMsg(undefined), [text]);

  const onImgChange = useCallback(
    (img) => onDataChange({ img }),
    [onDataChange],
  );

  return (
    <>
      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Title:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={title}
            data-prop="title"
            onChange={onInputChange}
            maxLength="45"
            rows="2"
            className={style.textarea}
          />
          <span className={style.bottomRight}>
            {title?.length ?? 0}
            /45
          </span>
        </div>
        {titleErrorMsg && (
          <Box>
            <Text color="status-error">{titleErrorMsg}</Text>
          </Box>
        )}
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Description:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text}
            className={style.textarea}
            rows="5"
            data-prop="text"
            onChange={onInputChange}
            maxLength="150"
          />
          <span className={style.bottomRight}>
            {text?.length ?? 0}
            /150
          </span>
        </div>
        {textErrorMsg && (
          <Box>
            <Text color="status-error">{textErrorMsg}</Text>
          </Box>
        )}
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon:</Heading>
        <ImageSelector
          required
          url={img}
          ref={imgSelectorRef}
          placeholder="https://"
          constraints={{
            acceptedFormats: ['svg', 'jpg', 'jpeg'],
            maxFileSize: 20_000,
          }}
          onChange={onImgChange}
        />
      </Box>
    </>
  );
});

export default SingleIconCardForm;
