import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { setMapData, setHabitat } from '../actions';

import style from './style.scss';

const HabitatMap = ({ habitats, setMapDataAction, setHabitatAction }) => {
  const { get, response } = useFetch(buildURL('/habitats/map'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const fetchData = async () => {
    await get();
    if (response.ok) {
      setMapDataAction(response.data.habitats);
    }
  }

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.map}>
      <div className={style.wrapper}>
        {habitats.filter(({ hidden, mapPosition }) => !hidden && mapPosition).map(({
          _id,
          online,
          liveTalk,
          profileImage,
          mapPosition: { top, left },
        }) => (
          <div
            key={_id}
            id={_id}
            style={{ top, left }}
            className={classnames(style.habitat, {
              [style.liveTalk]: liveTalk,
              [style.offline]: !online,
            })}
          >
            <button type="button" onClick={() => setHabitatAction(_id)}>
              <img src={profileImage} alt="" />
            </button>
          </div>
        ))}

        <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/zoolifeMap.png" alt="" />
      </div>
    </div>
  )
};

export default connect(
  ({ map: { habitats } }) => ({ habitats }),
  {
    setMapDataAction: setMapData,
    setHabitatAction: setHabitat,
  },
)(HabitatMap);
