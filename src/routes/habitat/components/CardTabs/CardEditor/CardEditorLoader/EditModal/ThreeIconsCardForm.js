import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'preact/hooks';
import {
  Box,
  Text,
  Heading,
  TextArea,
} from 'grommet';

import ImageSelector from 'Components/ImageSelector';

import style from './style.scss';

const ThreeIconsCardForm = forwardRef(({
  title,
  img1,
  img2,
  img3,
  text1,
  text2,
  text3,
  onInputChange,
  onDataChange,
}, ref) => {
  const img1Ref = useRef();
  const img2Ref = useRef();
  const img3Ref = useRef();
  const [titleErrorMsg, setTitleErrorMsg] = useState();
  const [text1ErrorMsg, setText1ErrorMsg] = useState();

  useImperativeHandle(ref, () => ({
    validate: async () => {
      let isValid = true;

      if (!title || title.length === 0) {
        setTitleErrorMsg('Title is required');
        isValid = false;
      }

      if (!text1 || text1.length === 0) {
        setText1ErrorMsg('Text is required');
        isValid = false;
      }

      const imagesValid = await Promise.all([
        img1Ref.current.validate(),
        img2Ref.current.validate(),
        img3Ref.current.validate(),
      ]);

      return isValid && imagesValid.every((valid) => valid === true);
    },
  }));

  useEffect(() => setTitleErrorMsg(undefined), [title]);
  useEffect(() => setText1ErrorMsg(undefined), [text1]);

  const onImg1Change = useCallback(
    (img1) => onDataChange({ img1 }),
    [onDataChange],
  );

  const onImg2Change = useCallback(
    (img2) => onDataChange({ img2 }),
    [onDataChange],
  );

  const onImg3Change = useCallback(
    (img3) => onDataChange({ img3 }),
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
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Item 1 Text:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text1}
            className={style.textarea}
            rows="3"
            data-prop="text1"
            onChange={onInputChange}
            maxLength="80"
          />
          <span className={style.bottomRight}>
            {text1?.length ?? 0}
            /80
          </span>
        </div>
        {text1ErrorMsg && (
          <Box>
            <Text color="status-error">{text1ErrorMsg}</Text>
          </Box>
        )}
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon:</Heading>
        <ImageSelector
          required
          url={img1}
          ref={img1Ref}
          placeholder="https://"
          constraints={{ acceptedFormats: ['svg', 'jpeg', 'jpg'] }}
          onChange={onImg1Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Item 2 Text:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text2}
            className={style.textarea}
            rows="3"
            data-prop="text2"
            onChange={onInputChange}
            maxLength="80"
          />
          <span className={style.bottomRight}>
            {text2?.length ?? 0}
            /80
          </span>
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon:</Heading>
        <ImageSelector
          url={img2}
          ref={img2Ref}
          placeholder="https://"
          constraints={{ acceptedFormats: ['svg', 'jpeg', 'jpg'] }}
          onChange={onImg2Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Item 3 Text:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text3}
            className={style.textarea}
            rows="3"
            data-prop="text3"
            onChange={onInputChange}
            maxLength="80"
          />
          <span className={style.bottomRight}>
            {text3?.length ?? 0}
            /80
          </span>
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon:</Heading>
        <ImageSelector
          url={img3}
          ref={img3Ref}
          placeholder="https://"
          constraints={{ acceptedFormats: ['svg', 'jpeg', 'jpg'] }}
          onChange={onImg3Change}
        />
      </Box>
    </>
  );
});

export default ThreeIconsCardForm;
