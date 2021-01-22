import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import {
  useEffect,
  useMemo,
  useState,
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

import style from './style.scss';

const ImageSelector = forwardRef(({
  label,
  url,
  placeholder,
  required,
  // used to recognize which property is being changed by the parent
  prop,
  constraints: {
    // used in case of square image
    maxResolution,
    minResolution,
    // width and height constraints are currently not implemented
    // we should add them latter if needed
    maxFileSize,
    aspectRatio,
    acceptedFormats,
  } = {},
  onChange,
  onBlur,
}, ref) => {
  const [errorMsg, setErrorMsg] = useState();
  const isUrlValid = useMemo(() => isValidUrl(url), [url]);

  useEffect(() => setErrorMsg(undefined), [url]);

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

      return isValid;
    },
  }));

  const constraintsMsg = useMemo(() => {
    const constraints = [];

    if (maxResolution && minResolution) {
      constraints.push(`Resolution: >${minResolution}, <${maxResolution}`);
    } else if (maxResolution) {
      constraints.push(`Resolution: <${maxResolution}`);
    } else if (minResolution) {
      constraints.push(`Resolution: >${minResolution}`);
    }

    if (maxFileSize) {
      constraints.push(`File: ${maxFileSize}`);
    }

    if (aspectRatio) {
      constraints.push(`Aspect Ratio: ${aspectRatio}`);
    }

    if (acceptedFormats) {
      if (acceptedFormats instanceof Array) {
        constraints.push(`Accepted Formats: ${acceptedFormats.join(', ')}`)
      } else {
        throw new Error('"acceptedFormats" accepts only arrays');
      }
    }

    return constraints.join(', ');
  }, [maxResolution, minResolution, maxFileSize, aspectRatio, acceptedFormats]);

  return (
    <div>
      {label && <Heading margin={{ top: '0', bottom: '5px' }} level="5">{label}</Heading>}
      <TextInput
        data-prop={prop}
        placeholder={placeholder}
        value={url}
        onChange={onChange}
        onBlur={onBlur}
      />
      {errorMsg && (
        <Box>
          <Text color="status-error">{errorMsg}</Text>
        </Box>
      )}
      <p className={style.constraints}>{constraintsMsg}</p>

      <Box direction="row">
        <Button label="Upload" margin={{ right: '5px' }} />

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
