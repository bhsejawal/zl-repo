import { h } from 'preact';
import {
  Box,
  Form,
  Text,
  Layer,
  TextInput,
  TextArea,
  Select,
} from 'grommet';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { pick, get } from 'lodash-es';

import Header from 'Components/modals/Header';
import { PrimaryButton } from 'Components/Buttons';
import {
  SELECT,
  TEXT_AUTOCOMPLETE,
  TEXT,
  TEXTAREA,
} from './constants';

import style from './style.scss';

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
      <Box height={{ max: '100%' }}>
        <Header onClose={onClose}>
          {item ? `Edit ${entity}` : `New ${entity}`}
        </Header>

        <Form onSubmit={onSubmit} className={style.form}>
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
              maxLength,
            }) => (
              <Box key={property} className={style.inputWrapper}>
                <Text margin={{ top: 'medium', bottom: 'small' }} size="large">
                  {title}
                </Text>
                {!editRender && type === TEXT && (
                  <TextInput
                    required={required}
                    name={property}
                    value={get(values, property)}
                    onChange={onInputChange}
                    maxLength={maxLength}
                  />
                )}

                {!editRender && type === SELECT && (
                  <Box>
                    <Select
                      name={property}
                      labelKey="label"
                      valueKey={{ key: 'value', reduce: true }}
                      value={typeof get(values, property) === 'boolean' ? get(values, property).toString() : get(values, property)}
                      options={selectValues}
                      onChange={onInputChange}
                    />
                  </Box>
                )}

                {!editRender && type === TEXT_AUTOCOMPLETE && (
                  <AutocompleteTextInput
                    postProperty={postProperty || property}
                    required={required}
                    selectValues={selectValues}
                    value={get(values, property)}
                  />
                )}

                {!editRender && type === TEXTAREA && (
                  <Box height={{ min: '150px', max: '150px' }}>
                    <TextArea
                      required={required}
                      name={property}
                      value={get(values, property)}
                      onChange={onInputChange}
                      fill
                      resize={false}
                      rows={10}
                      maxLength={maxLength}
                    />
                  </Box>
                )}

                {editRender && editRender(values)}
                {maxLength && <div className={style.counter}>{`${get(values, property, '').length}/${maxLength}`}</div>}
              </Box>
            ))}
          </Box>

          <Box pad={{ vertical: 'medium', horizontal: 'large' }} align="end" height={{ min: 'fit-content' }}>
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
      </Box>
    </Layer>
  );
};

export default ItemModal;
