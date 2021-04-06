import { h } from 'preact';
import { Button, Grommet } from 'grommet';

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
    <CardWrapper tag={tag}>
      <div className={style.wrapper}>
        <img className={style.img} src={consevationImages[status]} alt="" />

        <div className={style.middle}>
          <h4 className={style.title}>{title}</h4>
          <p className={style.text}>{text}</p>
        </div>

        <a target="_blank" rel="noopener noreferrer" href={btnLink}>
          <Button primary className={style.btn} label={btnLabel} />
        </a>
      </div>
    </CardWrapper>
  </Grommet>
);

export default ConservationCard;
