import { h } from 'preact';
import { forwardRef, useImperativeHandle } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import {
  Box,
  Text,
  Heading,
  TextArea,
  TextInput,
} from 'grommet';

import style from './style.scss';

const OriginAndHabitatCardForm = forwardRef(({
  title,
  text,
  location,
  onInputChange,
  onDataChange,
}, ref) => {
  const [titleErrorMsg, setTitleErrorMsg] = useState();
  const [textErrorMsg, setTextErrorMsg] = useState();
  const [locationErrorMsg, setLocationErrorMsg] = useState();

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      if (!title || title.length === 0) {
        setTitleErrorMsg('Title is required');
        isValid = false;
      }

      if (!text || text.length === 0) {
        setTextErrorMsg('Text is required');
        isValid = false;
      }

      if (!location || location.length === 0) {
        setLocationErrorMsg('Location is required');
      }

      return isValid;
    },
  }));

  useEffect(() => setTitleErrorMsg(undefined), [title]);
  useEffect(() => setTextErrorMsg(undefined), [text]);
  useEffect(() => setLocationErrorMsg(undefined), [location]);

  const onLocationBlur = () => {
    onDataChange({ img: `https://maps.googleapis.com/maps/api/staticmap?center=${location}&size=250x250&key=${process.env.PREACT_APP_MAPS_API_KEY}` });
  };

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
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Country Or Continent:</Heading>
        <TextInput
          reverse
          data-prop="location"
          value={location}
          onChange={onInputChange}
          onBlur={onLocationBlur}
          maxLength="50"
          icon={(
            <span style={{ color: locationErrorMsg && 'var(--red)' }}>
              {location?.length ?? 0}
              /50
            </span>
          )}
        />
        {locationErrorMsg && (
          <Box>
            <Text color="status-error">{locationErrorMsg}</Text>
          </Box>
        )}
      </Box>
    </>
  );
});

export default OriginAndHabitatCardForm;
