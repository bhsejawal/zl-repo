import { h } from 'preact';
import {
  useState,
  useRef,
  useMemo,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Text } from 'grommet';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'preact-router';

import HabitatsUpdater from 'Components/HabitatsUpdater';

import Card from './Card';

import { useOnClickOutside } from '../../../../hooks';

import style from './style.scss';

const LiveChannelsBar = ({
  height,
  width,
  currentHabitat,
  allHabitats,
}) => {
  const [expand, setExpand] = useState(false);
  const ref = useRef();
  const list = useMemo(
    () => {
      if (currentHabitat) {
        return allHabitats.filter(({ online, _id }) => online && _id !== currentHabitat)
      }
      return [];
    },
    [allHabitats, currentHabitat],
  );

  useOnClickOutside(ref, () => setExpand(false));

  return (
    <>
      <div ref={ref} className={style.liveTalktBar} style={{ height, width }}>
        <div className={classnames(style.expandBar, {[style.active]: expand})}>
          <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
            <Text size="medium" margin={{ right: '5px' }}>Live Now</Text>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className={classnames(style.listWrapper, 'customScrollBar')}>
            {currentHabitat && list.map(({
              _id,
              animal,
              profileImage,
              slug: habitatSlug,
              zoo: {
                slug: zooSlug,
                name: zooName,
              },
            }) => (
              <Card
                key={_id}
                image={profileImage}
                animal={animal}
                habitatSlug={habitatSlug}
                zoo={zooName}
                zooSlug={zooSlug}
              />
            ))}
          </div>
        </div>

        <div className={style.content}>
          <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
            <Text size="medium">Live Now</Text>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <ul className="customScrollBar">
            {list.map(({
              _id,
              profileImage,
              slug: habitatSlug,
              zoo: {
                slug: zooSlug,
              },
            }) => (
              <li key={_id}>
                <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)}>
                  <img src={profileImage} alt="" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <HabitatsUpdater />
    </>
  );
};

export default connect((
  { allHabitats, habitat },
) => (
  { allHabitats, currentHabitat: habitat?.habitatInfo?._id }
))(LiveChannelsBar);
