import { h } from 'preact';
import { Heading, Text, Box } from 'grommet';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const SingleIconCard = ({
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
      <Box flex="grow" justify="start" align="center">
        <Heading level="4" margin={{ top: '0', bottom: '0'}} textAlign="center">{title}</Heading>
        <Text size="large" textAlign="center" margin={{ top: '10px' }}>{text}</Text>
      </Box>
    </div>
  </CardWrapper>
);

export default SingleIconCard;
