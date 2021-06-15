import { h } from 'preact';
import { Heading, Text } from 'grommet';
import classnames from 'classnames';

import { formatAge } from '../../../../../../helpers';
import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const AnimalProfileCard = ({
  tag,
  img,
  name,
  title,
  sex,
  dateOfBirth,
  text1,
  text2,
  text3,
  className,
  mobile,
}) => (
  <CardWrapper className={classnames(className, { [style.mobile]: mobile })} tag={tag} hideTag>
    <div className={style.wrapper}>
      <img className={classnames('profileImg', style.img)} src={img} alt="" />
      <Heading level="4" margin={{ top: '20px', bottom: '0px' }}>{name}</Heading>
      {title && <Text size="highlight" weight={700} style={{ letterSpacing: '.5px'}} margin={{ top: '5px'}}>{title}</Text>}
      {sex && dateOfBirth && (
        <Text size="small" margin={{ top: '5px'}}>
          {sex}
          {', '}
          {formatAge(dateOfBirth)}
          {' '}
          old
        </Text>
      )}
      <ul className={style.list}>
        {text1 && <li><Text size="large">{text1}</Text></li>}
        {text2 && <li><Text size="large">{text2}</Text></li>}
        {text3 && <li><Text size="large">{text3}</Text></li>}
      </ul>
    </div>
  </CardWrapper>
);

export default AnimalProfileCard;
