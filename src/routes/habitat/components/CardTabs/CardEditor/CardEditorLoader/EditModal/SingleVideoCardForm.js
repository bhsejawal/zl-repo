import { h } from 'preact';
import { forwardRef, useImperativeHandle } from 'preact/compat';
import { useCallback, useRef } from 'preact/hooks';
import {
  Box,
  Heading,
  TextArea,
} from 'grommet';

import ImageSelector from 'Components/ImageSelector';

import style from './style.scss';

const SingleVideoCardForm = forwardRef(({
  videoUrl,
  title,
  text,
  onInputChange,
  onDataChange,
}, ref) => {
  const videoSelectorRef = useRef();

  useImperativeHandle(ref, () => ({
    validate: videoSelectorRef.current.validate,
  }));

  const onVideoChange = useCallback(
    (videoUrl) => onDataChange({ videoUrl }),
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
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Description:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text}
            className={style.textarea}
            rows="3"
            data-prop="text"
            onChange={onInputChange}
            maxLength="150"
          />
          <span className={style.bottomRight}>
            {text?.length ?? 0}
            /150
          </span>
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Video:</Heading>
        <ImageSelector
          required
          url={videoUrl}
          ref={videoSelectorRef}
          placeholder="https://"
          constraints={{
            acceptedFormats: ['mp4'],
            maxFileSize: 5_000_000,
          }}
          onChange={onVideoChange}
        />
      </Box>
    </>
  );
});

export default SingleVideoCardForm;
