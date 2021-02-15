import { useState, useEffect } from 'preact/hooks';
import { Box, CheckBoxGroup, DropButton } from 'grommet';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { FormDown, FormUp } from 'grommet-icons';

import Button from 'Components/Button';

import { setZooFilter, toggleZooFilter } from '../../actions';

import style from '../style.scss';

const ZooFilter = ({
  availableZoos,
  zoos,
  showZooFilter,
  toggleZooFilterAction,
  setZooFilterAction,
}) => {
  const [selectedZoos, setSelectedZoos] = useState([]);

  useEffect(() => {
    setSelectedZoos(zoos);
  }, [showZooFilter, zoos]);

  const onClearHandler = () => {
    if (zoos.length) {
      setZooFilterAction([]);
    } else {
      toggleZooFilterAction();
    }
  };

  if (!availableZoos) {
    return null;
  }

  let label = 'All Zoos';

  if (zoos.length) {
    label = zoos.length === 1 ? zoos[0] : `All Zoos (${zoos.length})`;
  }

  return (
    <DropButton
    label={<span>{label}</span>}
    dropAlign={{ top: 'bottom' }}
    size="small"
    icon={showZooFilter ? <FormUp /> : <FormDown />}
    reverse
    onOpen={toggleZooFilterAction}
    onClose={toggleZooFilterAction}
    dropContent={
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
          options={availableZoos}
          className={style.customCheckbox}
          value={selectedZoos}
          onChange={(evt) => setSelectedZoos(evt.value)}
        />
        <hr className={style.divider} />
        <Box direction="row" justify="between">
          <Button variant="outline" size="xs" onClick={onClearHandler}>Clear</Button>
          <Button variant="secondary" size="xs" onClick={() => setZooFilterAction(selectedZoos)}>Save</Button>
        </Box>
      </Box>
    }
    className={classnames(
      style.dropdownButton,
      { [style.active]: showZooFilter },
    )}
    dropProps={{ elevation: "xlarge" }}
    open={showZooFilter}
  />
  )
};

export default connect((
  {
    schedule: {
      availableZoos,
      filters: { zoos, showZooFilter },
    },
  },
) => (
  { availableZoos, zoos, showZooFilter }
), {
  setZooFilterAction: setZooFilter,
  toggleZooFilterAction: toggleZooFilter,
})(ZooFilter);
