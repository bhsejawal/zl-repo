import { useState, useEffect, useMemo } from 'preact/hooks';
import { DropButton, Box, CheckBoxGroup } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import classnames from 'classnames';

import { OutlineButton, PrimaryButton } from 'Components/Buttons';

import style from './style.scss';

const FilterButton = ({
  label: labelProp,
  items = [],
  filteredItems = [],
  onClear,
  onFilter,
}) => {
  const [selectedItems, setSelectedItems] = useState(filteredItems);
  const [isOpen, setIsOpen] = useState();

  const label = useMemo(() => {
    if (filteredItems.length === 0) {
      return labelProp;
    }
    if (filteredItems.length === 1) {
      const item = items.find((item) => filteredItems[0] === (item?.value ?? item));
      return item?.label ?? item ?? labelProp;
    }
    return `${labelProp} (${filteredItems.length})`;
  }, [filteredItems, labelProp, items]);

  useEffect(() => {
    setSelectedItems(filteredItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onClearHandler = () => {
    onClear();
    onClose();
  };

  const onSaveHandler = () => {
    onFilter(selectedItems);
    onClose();
  }

  return (
    <DropButton
      label={<span>{label}</span>}
      dropAlign={{ top: 'bottom' }}
      size="small"
      icon={isOpen ? <FormUp /> : <FormDown />}
      reverse
      onOpen={onOpen}
      onClose={onClose}
      className={classnames(style.dropdownButton, { [style.active]: isOpen })}
      dropProps={{ elevation: "xlarge" }}
      open={isOpen}
      dropContent={(
        <Box
          pad={{
            top: "medium",
            left: "medium",
            right: "medium",
            bottom: "small",
          }}
          className={style.filterBox}
        >
          <CheckBoxGroup
            options={items}
            className={style.customCheckbox}
            value={selectedItems}
            onChange={(evt) => setSelectedItems(evt.value)}
          />
          <hr className={style.divider} />
          <Box direction="row" justify="between">
            <OutlineButton onClick={onClearHandler} size="small" label="Clear" className={style.actionBtn} />
            <PrimaryButton onClick={onSaveHandler} size="small" label="Save" className={style.actionBtn} />
          </Box>
        </Box>
      )}
    />
  );
};

export default FilterButton;
