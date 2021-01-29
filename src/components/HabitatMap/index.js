import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';

import { fetchMapData } from './actions';

import style from './style.scss';

const HabitatMap = ({ habitats, fetchMapDataAction }) => {
  useEffect(() => {
    fetchMapDataAction();
  }, [fetchMapDataAction]);

  return (
    <div className={style.map}>
      <div className={style.wrapper}>
        {habitats.map((habitat) => {
          const [[id, data]] = Object.entries(habitat);
          const {
            top,
            left,
            border,
            link,
            image,
            width,
          } = data;

          return (
            <div
              key={id}
              className={style.habitat}
              style={{
                top,
                left,
                border,
                width,
                height: width,
              }}
            >
              <a href={link}>
                <img src={image} alt="" />
              </a>
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
  { fetchMapDataAction: fetchMapData },
)(HabitatMap);
