import { useState } from 'preact/hooks';
import { Link } from 'preact-router';
import {
  Box,
  Heading,
  Text,
  Button,
} from 'grommet';
import classnames from 'classnames';

import Accordion from '../../../account/Accordion';

import style from './style.scss';

const HabitatMobileCard = ({ habitat, isOffline }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!habitat) {
    return null;
  }

  return (
    <Accordion
      className={style.accordion}
      header={
        <Box direction="row" align="center" onClick={() => setIsOpen(!isOpen)} className={classnames({[style.offline]: isOffline })}>
          <img src={habitat.profileImage} className={style.habitatImage} alt="profile" />
          <Heading level={4} margin={{ left: "15px" }}>{habitat.animal}</Heading>
        </Box>
      }
    >
      <Box height={{ min: '132px' }} style={{ borderBottom: '1px solid #EBEBEB'}}>
        <Box height={{ min: '70px' }}>
          <Text size="xlarge">
            {habitat.description}
          </Text>
        </Box>
        <Box direction="row" justify="between" align="center" margin={{ bottom: "25px" }}>
          <img src={habitat.zoo.logo} alt="zoo" className={style.zooLogo} />
          <Link href={encodeURI(`/h/${habitat.zoo.slug}/${habitat.slug}`)}>
            <Button primary label="Enter Habitat" size="large" />
          </Link>
        </Box>
      </Box>
    </Accordion>
  )
}

export default HabitatMobileCard;
