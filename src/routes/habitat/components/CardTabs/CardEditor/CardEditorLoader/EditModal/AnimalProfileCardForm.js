import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useCallback,
} from 'preact/hooks';
import {
  Box,
  Heading,
  TextArea,
  TextInput,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import DatePicker from 'react-date-picker'
import { parseISO } from 'date-fns';
import ImageSelector from 'Components/ImageSelector';

import style from './style.scss';

const AnimalProfileCardForm = forwardRef(({
  img,
  name,
  title,
  sex,
  dateOfBirth,
  text1,
  text2,
  text3,
  onInputChange,
  onDataChange,
}, ref) => {
  const imgRef = useRef();
  const [nameErrorMsg, setNameErrorMsg] = useState();

  useImperativeHandle(ref, () => ({
    validate: async () => {
      let isValid = true;

      if (!name || name.length === 0) {
        setNameErrorMsg('Title is required');
        isValid = false;
      }

      const isImgValid = await imgRef.current.validate();
      return isValid && isImgValid;
    },
  }));

  useEffect(() => setNameErrorMsg(undefined), [name]);

  const onImgChange = useCallback(
    (img) => onDataChange({ img }),
    [onDataChange],
  );

  const onDateChange = useCallback(
    (value) => onDataChange({ dateOfBirth: value?.toISOString() }),
    [onDataChange],
  );

  return (
    <>
      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Image:</Heading>
        <ImageSelector
          required
          prop="img"
          url={img}
          ref={imgRef}
          placeholder="https://"
          constraints={{
            acceptedFormats: ['jpg', 'jpeg', 'png'],
            maxFileSize: 50_000,
          }}
          onBlur={onInputChange}
          onChange={onImgChange}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Name:</Heading>
        <TextInput
          reverse
          value={name}
          data-prop="name"
          onChange={onInputChange}
          maxLength="20"
          icon={(
            <span style={{ color: nameErrorMsg && 'var(--red)' }}>
              {name?.length ?? 0}
              /20
            </span>
          )}
        />
      </Box>

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
        <div className="simpleSelect">
          <select onChange={onInputChange} data-prop="sex">
            <option selected={sex === 'Male'} value="Male">
              Male
            </option>
            <option selected={sex === 'Female'} value="Female">
              Female
            </option>
          </select>

          <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <DatePicker
          format="MM/dd/yyyy"
          value={dateOfBirth && parseISO(dateOfBirth)}
          onChange={onDateChange}
          isClearable
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Item 1 Text:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text1}
            className={style.textarea}
            rows="2"
            data-prop="text1"
            onChange={onInputChange}
            maxLength="55"
          />
          <span className={style.bottomRight}>
            {text1?.length ?? 0}
            /55
          </span>
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Item 2 Text:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text2}
            className={style.textarea}
            rows="2"
            data-prop="text2"
            onChange={onInputChange}
            maxLength="55"
          />
          <span className={style.bottomRight}>
            {text2?.length ?? 0}
            /55
          </span>
        </div>
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Item 3 Text:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text3}
            className={style.textarea}
            rows="2"
            data-prop="text3"
            onChange={onInputChange}
            maxLength="55"
          />
          <span className={style.bottomRight}>
            {text3?.length ?? 0}
            /55
          </span>
        </div>
      </Box>
    </>
  );
});

export default AnimalProfileCardForm;
