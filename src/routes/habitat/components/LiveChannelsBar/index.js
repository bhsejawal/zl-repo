import { h } from 'preact';
import {
  useState,
  useRef,
  useMemo,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Text, Tip, Box } from 'grommet';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'preact-router';

import HabitatsUpdater from 'Components/HabitatsUpdater';
import Tag from 'Components/Tag';

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
      <div ref={ref} className={style.liveTalkBar} style={{ height, minWidth: width }}>
        <div className={classnames(style.expandBar, {[style.active]: expand})}>
          <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
            <Text size="medium" margin={{ right: '5px' }}>Live</Text>
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
              liveTalk,
            }) => (
              <Card
                key={_id}
                image={profileImage}
                animal={animal}
                habitatSlug={habitatSlug}
                zoo={zooName}
                zooSlug={zooSlug}
                liveTalk={liveTalk}
              />
            ))}
          </div>
        </div>

        <div className={style.content}>
          <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
            <Text size="medium">Live</Text>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <ul className="customScrollBar">
            {list.map(({
              _id,
              profileImage,
              slug: habitatSlug,
              animal,
              zoo: {
                slug: zooSlug,
                name: zooName,
              },
              liveTalk,
            }) => (
              <Tip
                content={(
                  <Box pad="xsmall">
                    <Text>
                      {`${animal} @ ${zooName}`}
                    </Text>
                  </Box>
                )}
                plain
                dropProps={{ align: { left: "right" }, background: { color: 'white' }}}
              >
                <li key={_id} className={style.item}>
                  <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)}>
                    <img src={profileImage} alt="" />
                    {liveTalk && (
                      <Tag
                        className={style.liveTag}
                        label="TALK"
                        varient="online"
                      />
                    )}
                  </Link>
                </li>
              </Tip>
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
