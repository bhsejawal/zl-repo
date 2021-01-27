import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { isEmpty } from 'lodash-es';
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useImperativeHandle,
} from 'preact/hooks';
import {
  Box,
  Text,
  Button,
  Heading,
  TextInput,
} from 'grommet';
import classnames from 'classnames';

import { isValidUrl } from '../../helpers';
import { uploadFile } from './api';

import style from './style.scss';

const RESOLUTION_CONSTRAINT = 'RESOLUTION_CONSTRAINT';
const FILE_SIZE_CONSTRAINT = 'FILE_SIZE_CONSTRAINT';
const ASPECT_RATIO_CONSTRAINT = 'ASPECT_RATIO_CONSTRAINT';
const ACCEPTED_FORMAT_CONSTRAINT = 'ACCEPTED_FORMAT_CONSTRAINT';

const ValidationLine = ({ error, text }) => (
  <Text color={error && 'status-error'}>{text}</Text>
);

const Constraints = ({ constraints, errors }) => constraints.map(({ type, text }, ind) => (
  <>
    <ValidationLine error={errors[type]} text={text} />
    {ind !== constraints.length - 1 && (', ')}
  </>
));

const ImageSelector = forwardRef(({
  label,
  url,
  placeholder,
  required,
  // used to recognize which property is being changed by the parent
  prop,
  // preview image ref that we can used to validate resolution
  previewRef,
  constraints: {
    maxResolution,
    minResolution,
    // TODO: implement size validation
    // maybe we could fetch it with HEAD request type
    maxFileSize,
    aspectRatio,
    acceptedFormats,
  } = {},
  onChange,
  onBlur,
}, ref) => {
  const [errorMsg, setErrorMsg] = useState();
  const [errors, setErrors] = useState({});
  const isUrlValid = useMemo(() => isValidUrl(url), [url]);

  useEffect(() => setErrorMsg(undefined), [url]);

  const validateConstraints = useCallback(() => {
    const newErrors = {};

    if (previewRef?.current) {
      const imgWidth = previewRef.current.naturalHeight;
      const imgHeight = previewRef.current.naturalWidth;

      if ((maxResolution && (imgWidth > maxResolution || imgHeight > maxResolution))
        || (minResolution && (imgWidth < maxResolution || imgHeight < maxResolution))
      ) {
        newErrors[RESOLUTION_CONSTRAINT] = true;
      } else {
        newErrors[RESOLUTION_CONSTRAINT] = false;
      }

      if (aspectRatio) {
        const [width, height] = aspectRatio.split(':').map(Number);
        if (width / height !== imgWidth / imgHeight) {
          newErrors[ASPECT_RATIO_CONSTRAINT] = true;
        } else {
          newErrors[ASPECT_RATIO_CONSTRAINT] = false;
        }
      }

      if (acceptedFormats && acceptedFormats.length > 0) {
        if (!acceptedFormats.some((format) => url.endsWith(format))) {
          newErrors[ACCEPTED_FORMAT_CONSTRAINT] = true;
        } else {
          newErrors[ACCEPTED_FORMAT_CONSTRAINT] = false;
        }
      }
    }

    return newErrors;
  }, [
    url,
    previewRef,
    maxResolution,
    minResolution,
    // TODO: implement this too
    // maxFileSize,
    aspectRatio,
    acceptedFormats,
  ]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const onLoad = () => {
      const newErrors = validateConstraints();
      if (!isEmpty(newErrors)) {
        setErrors(newErrors);
      }
    };

    const el = previewRef?.current;

    if (el) {
      el.addEventListener('load', onLoad);

      return () => {
        el.removeEventListener('load', onLoad);
      }
    }
  }, [validateConstraints, previewRef]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      if (required && (!url || url.length === 0)) {
        setErrorMsg('Image is required');
        isValid = false;
      } else if (!isUrlValid) {
        setErrorMsg('Invalid URL');
        isValid = false;
      }

      const newErrors = validateConstraints();

      if (!isEmpty(newErrors)) {
        setErrors({ ...errors, ...newErrors });
        isValid = false;
      }

      return isValid;
    },
  }));

  const constraints = useMemo(() => {
    const constraints = [];

    if (maxResolution && minResolution) {
      constraints.push({
        type: RESOLUTION_CONSTRAINT,
        text: `Resolution: >${minResolution}, <${maxResolution}`,
      });
    } else if (maxResolution) {
      constraints.push({
        type: RESOLUTION_CONSTRAINT,
        text: `Resolution: <${maxResolution}`,
      });
    } else if (minResolution) {
      constraints.push({
        type: RESOLUTION_CONSTRAINT,
        text: `Resolution: >${minResolution}`,
      });
    }

    if (maxFileSize) {
      constraints.push({
        type: FILE_SIZE_CONSTRAINT,
        text: `File: ${maxFileSize}`,
      });
    }

    if (aspectRatio) {
      constraints.push({
        type: ASPECT_RATIO_CONSTRAINT,
        text: `Aspect Ratio: ${aspectRatio}`,
      });
    }

    if (acceptedFormats) {
      if (acceptedFormats instanceof Array) {
        constraints.push({
          type: ACCEPTED_FORMAT_CONSTRAINT,
          text: `Accepted Formats: ${acceptedFormats.join(', ')}`,
        })
      } else {
        throw new Error('"acceptedFormats" accepts only arrays');
      }
    }

    return constraints;
  }, [maxResolution, minResolution, maxFileSize, aspectRatio, acceptedFormats]);

  const onInputChange = async ({ target }) => {
    try {
      const { url } = await uploadFile(target.files[0], maxResolution, acceptedFormats);
      onChange(url);
    } catch (err) {
      const { error } = err.body;

      if (error === 'Invalid format') {
        setErrors({ ...errors, [ACCEPTED_FORMAT_CONSTRAINT]: true });
      } else {
        console.log(err);
      }
    }
  };

  return (
    <div>
      {label && <Heading margin={{ top: '0', bottom: '5px' }} level="5">{label}</Heading>}
      <TextInput
        data-prop={prop}
        placeholder={placeholder}
        value={url}
        onBlur={onBlur}
      />
      {errorMsg && (
        <Box>
          <Text color="status-error">{errorMsg}</Text>
        </Box>
      )}
      <div className={style.constraints}>
        <Constraints constraints={constraints} errors={errors} />
      </div>

      <Box direction="row">
        <div className={style.uploadBtnWrapper}>
          <input onChange={onInputChange} type="file" name="file" />
          <Button label="Upload" margin={{ right: '5px' }} />
        </div>

        <a
          download
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={classnames({ [style.disabled]: !isUrlValid })}
        >
          <Button label="Download" disabled={!isUrlValid} />
        </a>
      </Box>
    </div>
  );
});

export default ImageSelector;
