import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Heading, Text } from 'grommet';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const AnimalBodyCard = ({
  tag,
  img,
  className,
  parts = [],
  mobile,
}) => {
  const [selectedInd, setSelectedInd] = useState(0);
  useMemo(() => parts.forEach((part) => {
    if (!part.id) {
      // eslint-disable-next-line no-param-reassign
      part.id = Symbol('id');
    }
  }), [parts]);

  useEffect(() => {
    if (selectedInd > parts.length - 1) {
      setSelectedInd(0);
    }
  }, [parts, selectedInd]);

  return (
    <CardWrapper noPadding className={classnames(className, { [style.mobile]: mobile })} tag={tag}>
      <div className={style.wrapper}>
        <div className={style.top}>
          <img className={style.img} src={img} alt="" />
          {parts.map((part, ind) => (
            // eslint-disable-next-line
            <div
              onClick={() => setSelectedInd(ind)}
              className={classnames(style.dot, { [style.selected]: ind === selectedInd })}
              style={{ top: `${part.y}%`, left: `${part.x}%` }}
            />
          ))}
        </div>

        <div className={style.bottom}>
          <Heading level="4" margin="0px">{parts[selectedInd]?.title}</Heading>
          <Text size="large" textAlign="center" margin={{ top: '10px' }}>{parts[selectedInd]?.text}</Text>
        </div>
      </div>
    </CardWrapper>
  );
};

export default AnimalBodyCard;
