import { h } from 'preact';

import { Heading, Text } from 'grommet';
import classnames from 'classnames';
import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const OriginAndHabitatCard = ({
  tag,
  img,
  title,
  text,
  className,
  mobile,
}) => (
  <CardWrapper className={classnames(className, { [style.mobile]: mobile })} tag={tag}>
    <div className={style.wrapper}>
      <div className={style.top}>
        <img className={style.img} src={img} alt="" />
      </div>
      <div className={style.bottom}>
        <Heading level="4" textAlign="center" margin={{ bottom: '10px' }}>{title}</Heading>
        <Text as="p" size="large" textAlign="center">{text}</Text>
      </div>
    </div>
  </CardWrapper>
);

export default OriginAndHabitatCard;
