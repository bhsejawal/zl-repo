import { h } from 'preact';
import { memo } from 'preact/compat';
import { Link } from 'preact-router';
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/pro-solid-svg-icons';
import { Button as GrommetButton } from 'grommet';
import classnames from 'classnames';

import Tag from 'Components/Tag';
import Button from 'Components/Button';

import style from './style.scss';

const HabitatStatus = ({ online, liveTalk }) => {
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

const HabitatCard = ({
  className,
  habitatId,
  slug,
  online,
  liveTalk,
  card: {
    image,
    logo,
    title,
    description,
  } = {},
  onFavoriteClick,
}) => (
  <div className={classnames(style.habitatCard, className)}>
    <div className={style.header}>
      <img src={image} alt="" />
      <div className={style.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={style.tag}>
        <HabitatStatus online={online} liveTalk={liveTalk} />
      </div>
    </div>
    <div className={style.body}>
      <h3>{title}</h3>
      <p>{description}</p>

      <div className={classnames(style.buttons, { [style.favorite]: onFavoriteClick })}>
        <Link href={`/zoo/${slug}`}>
          <Button variant="primary" size="" type="button">
            Enter Habitat
          </Button>
        </Link>
        {onFavoriteClick && (
          <GrommetButton
            onClick={() => onFavoriteClick(habitatId)}
            margin={{ horizontal: 'small' }}
          >
            <FontAwesomeIcon icon={faHeart} color="var(--pink)" size="2x" />
          </GrommetButton>
        )}
      </div>
    </div>
  </div>
);

export default memo(HabitatCard)
