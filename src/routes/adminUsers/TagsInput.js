import { h } from 'preact';
import {
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'preact/hooks';
import { get } from 'lodash-es';

import { FormClose } from 'grommet-icons';
import {
  Box,
  Button,
  Keyboard,
  Text,
  TextInput,
} from 'grommet';

const Tag = ({ children, onRemove }) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
      margin="xxsmall"
      round="medium"
    >
      <Text size="xsmall" margin={{ right: 'xxsmall' }}>
        {children}
      </Text>
      {onRemove && <FormClose size="small" color="white" />}
    </Box>
  );

  if (onRemove) {
    return <Button onClick={onRemove}>{tag}</Button>;
  }
  return tag;
};

const TagInput = ({
  values = [],
  onAdd,
  onChange,
  onRemove,
  suggestions,
}) => {
  const [currentTag, setCurrentTag] = useState('');
  const boxRef = useRef();

  const updateCurrentTag = (event) => {
    setCurrentTag(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const onAddTag = (tag) => {
    if (onAdd) {
      onAdd(tag);
    }
  };

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag);
      setCurrentTag('');
    }
  };

  const renderValues = useMemo(() => values
    .map((slug, index) => (
      <Tag
        margin="xxsmall"
        key={slug}
        onRemove={() => onRemove(slug, index)}
      >
        {slug}
      </Tag>
    )), [values, onRemove]);

  return (
    <Keyboard onEnter={onEnter}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: 'xsmall' }}
        border="all"
        ref={boxRef}
        style={{ borderRadius: '3px' }}
        wrap
      >
        {values.length > 0 && renderValues}
        <Box flex style={{ minWidth: '120px' }}>
          <TextInput
            type="search"
            plain
            dropTarget={boxRef.current}
            placeholder="Search for habitats..."
            onChange={updateCurrentTag}
            value={currentTag}
            suggestions={suggestions}
            onSuggestionSelect={(event) => onAddTag(event.suggestion)}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

const WithTags = ({
  name,
  values,
  onChange,
  selected = [],
}) => {
  const [search, setSearch] = useState('');
  const selectedSlugs = useMemo(
    () => selected.map((id) => values.find(({ _id }) => id === _id)?.slug),
    [selected, values],
  );
  const suggestions = useMemo(() => {
    const suggestions = values.filter(({ _id }) => !selected.includes(_id)).map(({ slug }) => slug);

    if (search.length) {
      return suggestions.filter((slug) => slug.toLowerCase().includes(search.toLowerCase()));
    }

    return suggestions;
  }, [values, selected, search]);

  const onRemoveTag = useCallback((tag, index) => {
    const newSelectedIds = [...selected];
    newSelectedIds.splice(index, 1);
    onChange({ target: { name, value: [...newSelectedIds]}})
  }, [name, onChange, selected]);

  const onAddTag = (tag) => {
    const tagId = get(values.find(({ slug }) => slug.toLowerCase() === tag.toLocaleString()), '_id', null);

    if (tagId) {
      onChange({ target: { name, value: [...selected, tagId]}});
    }
    setSearch('');
  }

  const onSearch = ({ target: { value }}) => {
    setSearch(value);
  }

  return (
    <TagInput
      placeholder="Search for habitats..."
      suggestions={suggestions}
      values={selectedSlugs}
      onRemove={onRemoveTag}
      onAdd={onAddTag}
      onChange={onSearch}
    />
  );
};

export default WithTags;
