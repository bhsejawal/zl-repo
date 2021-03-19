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
import { useMemo, useState } from 'preact/hooks';
import { pick } from 'lodash-es';
import { PrimaryButton } from 'Components/Buttons';
import { SELECT, TEXT } from './constants';

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
  }

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (loading) {
      return;
    }

    const formEntries = Array.from(new FormData(evt.target).entries())
      .filter(([key]) => editableColumns.some(({ property }) => property === key));
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
        <Box pad={{ vertical: 'medium', horizontal: 'large' }}>
          {editableColumns.map(({
            property,
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
                  value={values[property]}
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
                        selected={values[property]
                          ? value === values[property]
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
