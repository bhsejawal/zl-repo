import {
  useMemo,
  useContext,
} from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Text,
  Box,
  Grid,
  ResponsiveContext,
} from 'grommet';

import HabitatsUpdater from 'Components/HabitatsUpdater';

import Accordion from '../../routes/account/Accordion';
import HabitatCard from './HabitatCard';

import animal from './animal.png'
import style from './style.scss';

const getColumnSize = (size) => {
  if (['xsmall', 'small'].includes(size)) {
    return ['auto'];
  }
  if (size === 'medium') {
    return ['auto', 'auto'];
  }
  return ['auto', 'auto', 'auto'];
}

const AnimalCollapsible = ({ freeHabitat, allHabitats = []}) => {
  const size = useContext(ResponsiveContext);

  const habitats = useMemo(() => allHabitats.filter(
    ({ _id, hidden, zoo }) => (_id !== freeHabitat && !hidden && zoo ),
  ), [freeHabitat, allHabitats]);

  if (!habitats || !allHabitats) {
    return null;
  }

  if (habitats.length === 0) {
    return null;
  }

  return (
    <>
      <Accordion
        className={style.accordionPlans}
        header={
          // This is in reverse order, so we can use row-reverse
          // to place the button as the last element of the accorion
          <>
            <Text
              color="var(--charcoal)"
              size="xlarge"
              weight="bold"
              margin={{ left: '13px' }}
            >
              Meet the Animals
            </Text>
            <img src={animal} alt="animal" className={style.animalsImage} />
          </>
        }
      >
        <Box background="#F9FCE7" fill="horizontal" align="center" pad={{ vertical: '15px' }}>
          <Grid columns={getColumnSize(size)} gap={{ column: 'xlarge' }}>
            {habitats.map(({
              _id,
              profileImage,
              title,
              zoo: { logo },
            }) => (
              <HabitatCard
                habitatImage={profileImage}
                title={title}
                zooImage={logo}
                key={_id}
              />
            ))}
          </Grid>
        </Box>
      </Accordion>
      <HabitatsUpdater />
    </>
  )
}

export default connect(({
  user: { subscription: { freeHabitat } },
  allHabitats,
}) => ({
  freeHabitat, allHabitats,
}))(AnimalCollapsible);
