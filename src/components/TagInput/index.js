import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import {
  Box,
  Button,
  Keyboard,
  TextInput,
  Text,
  FormField,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { last } from 'lodash-es';
import classnames from 'classnames';

import style from './style.scss';

const Tag = ({ children, onRemove }) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="transparent"
      border="all"
      pad={{ horizontal: 'small', vertical: 'xsmall' }}
      margin={{ vertical: 'xxsmall', horizontal: 'xxsmall' }}
      round="medium"
      justify="center"
    >
      <Text
        size="large"
        margin={{ right: 'xsmall' }}
        className={style.tagText}
        alignSelf="center"
      >
        {children}
      </Text>
      {onRemove && <FontAwesomeIcon icon={faTimes} />}
    </Box>
  );

  if (onRemove) {
    return (
      <Button className={style.tagBtn} onClick={onRemove}>
        {tag}
      </Button>
    );
  }
  return tag;
};

const TagInput = forwardRef(({
  value = [],
  onAdd,
  onChange,
  onRemove,
  onValidate,
  label,
  name,
  ...rest
}, ref) => {
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState();
  const tagListRef = useRef();

  useEffect(() => {
    setError(undefined);
  }, [currentTag]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      last(tagListRef.current.children)?.scrollIntoView();
    }, 0);
    return () => clearTimeout(timeout);
  }, [value]);

  const updateCurrentTag = (event) => {
    setCurrentTag(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const onAddTag = useCallback((tag) => {
    if (onAdd) {
      onAdd(tag);
    }
  }, [onAdd]);

  const addNewItem = useCallback(({ target }) => {
    try {
      if (!currentTag && tagListRef.current.children.length > 0) {
        return;
      }

      onValidate?.({ target, value: currentTag });
      onAddTag(currentTag);
      setCurrentTag('');
    } catch (err) {
      setError(err.message);
    }
  }, [currentTag, onValidate, onAddTag]);

  return (
    <Keyboard onEnter={addNewItem}>
      <Box
        ref={ref}
        direction="row"
        align="center"
        pad={{ horizontal: 'xsmall' }}
        wrap
      >
        <FormField className={style.input} label={label} name={name}>
          <div
            ref={tagListRef}
            className={classnames(style.values, 'customScrollBar', 'grey')}
          >
            {value.length > 0 && value.map((value, index) => (
              <Tag
                margin="xxsmall"
                key={`${value}${index + 0}`}
                onRemove={() => onRemove({ value, index })}
              >
                {value}
              </Tag>
            ))}
          </div>

          <TextInput
            type="email"
            plain
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rest}
            onChange={updateCurrentTag}
            value={currentTag}
            onBlur={addNewItem}
          />
        </FormField>
        {error && (
          <Box pad={{ horizontal: 'small' }}>
            <Text color="status-error">{error}</Text>
          </Box>
        )}
      </Box>
    </Keyboard>
  );
});

export default TagInput;
