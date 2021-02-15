import { useState, useEffect } from 'preact/hooks';
import { Box, CheckBoxGroup, DropButton } from 'grommet';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { FormDown, FormUp } from 'grommet-icons';

import Button from 'Components/Button';

import { setAnimalFilter, toggleAnimalFilter } from '../../actions';

import style from '../style.scss';

const AnimalFilter = ({
  availableAnimals,
  animals,
  showAnimalFilter,
  toggleAnimalFilterAction,
  setAnimalFilterAction,
}) => {
  const [selectedAnimals, setSelectedAnimals] = useState([]);

  useEffect(() => {
    setSelectedAnimals(animals);
  }, [showAnimalFilter, animals]);

  let label = 'All Animals';

  if (!availableAnimals) {
    return null;
  }

  if (animals.length) {
    label = animals.length === 1 ? animals[0] : `All Animals (${animals.length})`;
  }

  const onClearHandler = () => {
    if (animals.length) {
      setAnimalFilterAction([]);
    } else {
      toggleAnimalFilterAction();
    }
  };

  return (<DropButton
    label={<span>{label}</span>}
    dropAlign={{ top: 'bottom' }}
    size="small"
    icon={showAnimalFilter ? <FormUp /> : <FormDown />}
    reverse
    onOpen={toggleAnimalFilterAction}
    onClose={toggleAnimalFilterAction}
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
          options={availableAnimals}
          className={style.customCheckbox}
          value={selectedAnimals}
          onChange={(evt) => setSelectedAnimals(evt.value)}
        />
        <hr className={style.divider} />
        <Box direction="row" justify="between">
          <Button variant="outline" size="xs" onClick={onClearHandler}>Clear</Button>
          <Button variant="secondary" size="xs" onClick={() => setAnimalFilterAction(selectedAnimals)}>Save</Button>
        </Box>
      </Box>
    }
    className={classnames(
      style.dropdownButton,
      { [style.active]: showAnimalFilter },
    )}
    dropProps={{ elevation: "xlarge" }}
    open={showAnimalFilter}
  />)
};

export default connect((
  {
    schedule: {
      availableAnimals,
      filters: { animals, showAnimalFilter },
    },
  },
) => (
  { availableAnimals, animals, showAnimalFilter }
), {
  setAnimalFilterAction: setAnimalFilter,
  toggleAnimalFilterAction: toggleAnimalFilter,
})(AnimalFilter);
