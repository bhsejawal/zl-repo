import { h } from 'preact';
import {
  Grommet,
  Heading,
  Text,
  Box,
} from 'grommet';

import { OutlineButton } from 'Components/Buttons';

import criticallyEndangered from 'Assets/conservationCards/critically_endangered.png';
import dataDeficient from 'Assets/conservationCards/data_deficient.png';
import endangered from 'Assets/conservationCards/endangered.png';
import extinctInWild from 'Assets/conservationCards/extinct_in_wild.png';
import extinct from 'Assets/conservationCards/extinct.png';
import leastConcerned from 'Assets/conservationCards/least_concerned.png';
import nearThreatened from 'Assets/conservationCards/near_threateaned.png';
import vulnerable from 'Assets/conservationCards/vulnerable.png';

import CardWrapper from '../components/CardWrapper';

import {
  CRITICALLY_ENDANGERED,
  DATA_DEFICIENT,
  ENDANGERED,
  EXTINCT_IN_THE_WILD,
  EXTINCT,
  LEAST_CONCERNED,
  NEAR_THREATENED,
  VULNERABLE,
} from '../../constants';

import grommetTheme from '../../../../../../grommetTheme';

import style from './style.scss';

const consevationImages = {
  [CRITICALLY_ENDANGERED]: criticallyEndangered,
  [DATA_DEFICIENT]: dataDeficient,
  [ENDANGERED]: endangered,
  [EXTINCT_IN_THE_WILD]: extinctInWild,
  [EXTINCT]: extinct,
  [LEAST_CONCERNED]: leastConcerned,
  [NEAR_THREATENED]: nearThreatened,
  [VULNERABLE]: vulnerable,
};

const ConservationCard = ({
  tag,
  status,
  title,
  text,
  btnLabel,
  btnLink,
}) => (
  <Grommet theme={grommetTheme}>
    <CardWrapper tag={tag} padding="25px 0px">
      <Box align="center" justify="center" fill>
        <img className={style.img} src={consevationImages[status]} alt="" />

        <Box align="center" pad={{ horizontal: '20px' }}>
          <Heading level="4" textAlign="center" margin="20px 0px">{title}</Heading>
          <Text size="large" textAlign="center" >{text}</Text>
        </Box>
        <Box margin={{ top: '18px' }}>
          <a target="_blank" rel="noopener noreferrer" href={btnLink}>
            <OutlineButton
              label={btnLabel}
              type="button"
            />
          </a>
        </Box>
      </Box>
    </CardWrapper>
  </Grommet>
);

export default ConservationCard;
