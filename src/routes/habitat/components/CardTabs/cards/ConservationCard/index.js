import { h } from 'preact';
import { Button, Grommet } from 'grommet';

import endanngeredImg from './endangered.png';
import criticallyEndangeredImg from './critical.png';
import extinctImg from './extinct.png';

import CardWrapper from '../components/CardWrapper';

import { CRITICALLY_ENDANGERED, ENDANGERED, EXTINCT_IN_THE_WILD } from '../../constants';
import grommetTheme from '../../../../../../grommetTheme';

import style from './style.scss';

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
        {status === ENDANGERED && (
          <img className={style.img} src={endanngeredImg} alt="" />
        )}
        {status === CRITICALLY_ENDANGERED && (
          <img className={style.img} src={criticallyEndangeredImg} alt="" />
        )}
        {status === EXTINCT_IN_THE_WILD && (
          <img className={style.img} src={extinctImg} alt="" />
        )}

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
