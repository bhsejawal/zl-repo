import { h } from 'preact';
import { forwardRef, useImperativeHandle } from 'preact/compat';
import { useCallback, useRef } from 'preact/hooks';
import { Box, Heading, TextArea } from 'grommet';

import ImageSelector from 'Components/ImageSelector';

import style from './style.scss';

const TwoVideosCardForm = forwardRef(({
  video1Url,
  text1,
  video2Url,
  text2,
  onInputChange,
  onDataChange,
}, ref) => {
  const video1SelectorRef = useRef();
  const video2SelectorRef = useRef();

  useImperativeHandle(ref, () => ({
    validate: () => Promise.all([
      video1SelectorRef.current.validate(),
      video2SelectorRef.current.validate(),
    ]),
  }));

  const onVideo1Change = useCallback(
    (video1Url) => onDataChange({ video1Url }),
    [onDataChange],
  );

  const onVideo2Change = useCallback(
    (video2Url) => onDataChange({ video2Url }),
    [onDataChange],
  );

  return (
    <>
      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Video 1:</Heading>
        <ImageSelector
          required
          prop="video1Url"
          url={video1Url}
          ref={video1SelectorRef}
          placeholder="https://"
          constraints={{
            acceptedFormats: ['mp4'],
            maxFileSize: 3_000_000,
          }}
          onBlur={onInputChange}
          onChange={onVideo1Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Description 1:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text1}
            className={style.textarea}
            rows="3"
            data-prop="text1"
            onChange={onInputChange}
            maxLength="60"
          />
          <span className={style.bottomRight}>
            {text1?.length ?? 0}
            /60
          </span>
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Video 2:</Heading>
        <ImageSelector
          required
          prop="video2Url"
          url={video2Url}
          ref={video2SelectorRef}
          placeholder="https://"
          constraints={{
            acceptedFormats: ['mp4'],
            maxFileSize: 3_000_000,
          }}
          onBlur={onInputChange}
          onChange={onVideo2Change}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Description 2:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text2}
            className={style.textarea}
            rows="3"
            data-prop="text2"
            onChange={onInputChange}
            maxLength="60"
          />
          <span className={style.bottomRight}>
            {text2?.length ?? 0}
            /60
          </span>
        </div>
      </Box>
    </>
  );
});

export default TwoVideosCardForm;
