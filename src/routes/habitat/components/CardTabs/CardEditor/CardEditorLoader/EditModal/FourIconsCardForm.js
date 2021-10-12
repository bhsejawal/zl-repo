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
  TextInput,
} from 'grommet';
import ImageSelector from 'Components/ImageSelector';

import style from './style.scss';

const FourIconsCardForm = forwardRef(({
  title,
  text,
  img1,
  img2,
  img3,
  img4,
  icon1Txt,
  icon2Txt,
  icon3Txt,
  icon4Txt,
  onInputChange,
  onDataChange,
}, ref) => {
  const img1Ref = useRef();
  const img2Ref = useRef();
  const img3Ref = useRef();
  const img4Ref = useRef();
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

      const imagesValid = await Promise.all([
        img1Ref.current.validate(),
        img2Ref.current.validate(),
        img3Ref.current.validate(),
        img4Ref.current.validate(),
      ]);

      return isValid && imagesValid.every((valid) => valid === true);
    },
  }));

  useEffect(() => setTitleErrorMsg(undefined), [title]);
  useEffect(() => setTextErrorMsg(undefined), [text]);

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

  const onImg4Change = useCallback(
    (img4) => onDataChange({ img4 }),
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
            value={text}
            className={style.textarea}
            rows="5"
            data-prop="text"
            onChange={onInputChange}
            maxLength="120"
          />
          <span className={style.bottomRight}>
            {text?.length ?? 0}
            /120
          </span>
        </div>
        {textErrorMsg && (
          <Box>
            <Text color="status-error">{textErrorMsg}</Text>
          </Box>
        )}
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 1:</Heading>
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
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 1 Text:</Heading>
        <TextInput
          reverse
          value={icon1Txt}
          data-prop="icon1Txt"
          onChange={onInputChange}
          maxLength="12"
          icon={(
            <span>
              {icon1Txt?.length ?? 0}
              /12
            </span>
          )}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 2:</Heading>
        <ImageSelector
          required
          url={img2}
          ref={img2Ref}
          placeholder="https://"
          constraints={{ acceptedFormats: ['svg', 'jpeg', 'jpg'] }}
          onChange={onImg2Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 2 Text:</Heading>
        <TextInput
          reverse
          value={icon2Txt}
          data-prop="icon2Txt"
          onChange={onInputChange}
          maxLength="12"
          icon={(
            <span>
              {icon2Txt?.length ?? 0}
              /12
            </span>
          )}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 3:</Heading>
        <ImageSelector
          required
          url={img3}
          ref={img3Ref}
          placeholder="https://"
          constraints={{ acceptedFormats: ['svg', 'jpeg', 'jpg'] }}
          onChange={onImg3Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 3 Text:</Heading>
        <TextInput
          reverse
          value={icon3Txt}
          data-prop="icon3Txt"
          onChange={onInputChange}
          maxLength="12"
          icon={(
            <span>
              {icon3Txt?.length ?? 0}
              /12
            </span>
          )}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 4:</Heading>
        <ImageSelector
          required
          url={img4}
          ref={img4Ref}
          placeholder="https://"
          constraints={{ acceptedFormats: ['svg', 'jpeg', 'jpg'] }}
          onChange={onImg4Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Icon 4 Text:</Heading>
        <TextInput
          reverse
          value={icon4Txt}
          data-prop="icon4Txt"
          onChange={onInputChange}
          maxLength="12"
          icon={(
            <span>
              {icon4Txt?.length ?? 0}
              /12
            </span>
          )}
        />
      </Box>
    </>
  );
});

export default FourIconsCardForm;
