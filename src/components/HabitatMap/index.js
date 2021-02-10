import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { fetchMapData, setHabitat } from './actions';

import style from './style.scss';

const HabitatMap = ({ habitats, fetchMapDataAction, setHabitatAction }) => {
  useEffect(() => {
    fetchMapDataAction();
  }, [fetchMapDataAction]);

  return (
    <div className={style.map}>
      <div className={style.wrapper}>
        {habitats.filter(( show ) => show).map((habitat) => {
          const {
            id,
            online,
            liveTalk,
            top,
            left,
            image,
          } = habitat;

          return (
            <div
              key={id}
              id={id}
              className={classnames(
                style.habitat, { [style.liveTalk]: liveTalk, [style.offline]: !online },
              )}
              style={{top, left}}
            >
              <button type="button" onClick={() => setHabitatAction(id)}>
                <img src={image} alt="" />
              </button>
            </div>
          )
        })}
        <img src="https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/map.png" alt="" />
      </div>
    </div>
  )
};

export default connect(
  ({ map: { habitats } }) => ({ habitats }),
  {
    fetchMapDataAction: fetchMapData,
    setHabitatAction: setHabitat,
  },
)(HabitatMap);
