import { Fragment, h } from 'preact';
import {
  Box,
  Button,
  Form,
  Text,
  Heading,
  Layer,
  TextInput,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { pick, get } from 'lodash-es';

import { PrimaryButton } from 'Components/Buttons';
import { SELECT, TEXT_AUTOCOMPLETE, TEXT } from './constants';

// TODO: we should replace this with Select when Grommet issue is fixed
const AutocompleteTextInput = ({
  required,
  postProperty,
  value: valueProp,
  selectValues,
}) => {
  const initialSuggestions = useMemo(() => selectValues.map(({ label }) => label), [selectValues]);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [error, setError] = useState();
  const initialValue = useMemo(
    () => selectValues.find(({ label }) => label === valueProp)?.value,
    [],
  );
  const [mappedVal, setMappedVal] = useState(initialValue || '');
  const [label, setLabel] = useState(valueProp);

  const onChange = ({ target }) => {
    setSuggestions(initialSuggestions.filter(
      (v) => v.toLowerCase().includes(target.value.toLowerCase()),
    ));
    const { value: val } = selectValues
      .find(({ label }) => label === target.value) || {};
    setMappedVal(val || '');
    setLabel(target.value);
  };

  const onAutocompleteSelect = (value) => {
    const { value: val } = selectValues
      .find(({ label }) => label === value) || {};
    setMappedVal(val || '');
    setLabel(value);
  };

  useEffect(() => {
    if (!mappedVal && required) {
      setError(true);
    } else {
      setError(false);
    }
  }, [mappedVal, required]);

  return (
    <div>
      <TextInput
        hidden
        required={required}
        name={postProperty}
        value={mappedVal}
      />
      <TextInput
        required={required}
        value={label}
        onChange={onChange}
        onSuggestionSelect={({ suggestion }) => onAutocompleteSelect(suggestion)}
        suggestions={suggestions}
      />
      {error && (
        <Box pad="small">
          <Text color="status-error">Invalid value. Please select an item from the list.</Text>
        </Box>
      )}
    </div>
  );
};

const ItemModal = ({
  item,
  entity,
  columns,
  onItemEdit,
  onNewItem,
  onClose,
}) => {
  const editableColumns = useMemo(
    () => columns.filter(({ editable }) => editable),
    [columns],
  );

  const initialValues = useMemo(() => {
    const editableKeys = editableColumns.map(({ property }) => property);
    return pick(item, editableKeys);
  }, [editableColumns, item]);

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const onInputChange = ({ target: { name, value } }) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (loading) {
      return;
    }

    const formEntries = Array.from(new FormData(evt.target).entries())
      .filter(([key]) => editableColumns.some(
        ({ postProperty, property }) => (postProperty === key || property === key),
      ));
    const itemData = Object.fromEntries(formEntries);

    try {
      setLoading(true);
      if (item) {
        await onItemEdit(itemData);
      } else {
        await onNewItem(itemData);
      }
      setError(undefined);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box
        width="large"
        direction="row"
        align="center"
        as="header"
        elevation="small"
        justify="between"
      >
        <Heading level="2" margin={{ vertical: 'medium', horizontal: 'large' }}>
          {item ? `Edit ${entity}` : `New ${entity}`}
        </Heading>
        <Button
          plain
          margin="medium"
          onClick={onClose}
          icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
        />
      </Box>

      <Form onSubmit={onSubmit}>
        <Box
          overflow="auto"
          height={{ max: 'calc(100vh - 200px)' }}
          pad={{ vertical: 'medium', horizontal: 'large' }}
        >
          {editableColumns.map(({
            property,
            postProperty,
            title,
            required = true,
            type = TEXT,
            selectValues,
            editRender,
          }) => (
            <Fragment key={property}>
              <Text margin={{ top: 'medium', bottom: 'small' }} size="large">
                {title}
              </Text>

              {!editRender && type === TEXT && (
                <TextInput
                  required={required}
                  name={property}
                  value={get(values, property)}
                  onChange={onInputChange}
                />
              )}

              {!editRender && type === SELECT && (
                <div className="simpleSelect">
                  <select
                    name={property}
                    required={required}
                    onChange={onInputChange}
                  >
                    {selectValues.map(({ label, value }, ind) => (
                      <option
                        selected={get(values, property)
                          ? value === get(values, property)
                          : ind === 0}
                        value={value}
                      >
                        {label}
                      </option>
                    ))}
                  </select>

                  <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
                </div>
              )}

              {!editRender && type === TEXT_AUTOCOMPLETE && (
                <AutocompleteTextInput
                  postProperty={postProperty || property}
                  required={required}
                  selectValues={selectValues}
                  value={get(values, property)}
                />
              )}

              {editRender && editRender(values)}
            </Fragment>
          ))}
        </Box>

        <Box pad={{ vertical: 'medium', horizontal: 'large' }} align="end">
          <PrimaryButton
            primary
            size="large"
            type="submit"
            loading={loading}
            label={item ? 'Save Changes' : 'Done'}
          />

          {error && (
            <Box pad="small">
              <Text color="status-error">{error}</Text>
            </Box>
          )}
        </Box>
      </Form>
    </Layer>
  );
};

export default ItemModal;
