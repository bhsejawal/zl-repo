import { h } from 'preact';
import { connect } from 'react-redux';
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Tag from 'Components/Tag';
import Button from 'Components/Button';

import style from './style.scss';

const habitatStatus = (online, liveTalk) => {
  let label = online ? 'Online' : 'Offline'

  if (online && liveTalk) {
    label = 'Live Talk';
  }

  return (
    <Tag
      label={(
        <span>
          {(online || liveTalk) && <FontAwesomeIcon icon={faCircle} />}
          <span>{label}</span>
        </span>
      )}
      varient={online && liveTalk ? 'liveTalk' : label.toLowerCase()}
    />
  )
};

const MapCard = ({ activeHabitat, habitats }) => {
  const habitatData = habitats.find(({ id }) => id === activeHabitat)

  if (!activeHabitat || !habitatData) {
    return null;
  }

  const {
    online,
    liveTalk,
    card: {
      image,
      logo,
      title,
      description,
    },
  } = habitatData;

  return (
    <div className={style.mapCard}>
      <div className={style.header}>
        <img src={image} alt="" />
        <div className={style.logo}>
          <img src={logo} alt="" />
        </div>
        <div className={style.tag}>
          {habitatStatus(online, liveTalk)}
        </div>
      </div>
      <div className={style.body}>
        <h3>{title}</h3>
        <p>
          {description}
        </p>
        <Button variant="primary" size="" type="button" className={style.button}>
          Enter Habitat
        </Button>
      </div>
    </div>
  );
};

export default connect(
  ({ map: { activeHabitat, habitats }}) => ({ activeHabitat, habitats }),
)(MapCard);
