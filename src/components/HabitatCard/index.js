import { h } from 'preact';
import { memo } from 'preact/compat';
import { Link } from 'preact-router';
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/pro-solid-svg-icons';
import { Button } from 'grommet';
import classnames from 'classnames';

import Tag from 'Components/Tag';

import zooPlaceholder from './zooPlaceholder.png';
import wideImgPlaceholder from './wideImgPlaceholder.png';

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
  zooSlug,
  slug,
  online,
  liveTalk,
  image,
  logo,
  title,
  description,
  onFavoriteClick,
}) => (
  <div className={classnames(style.habitatCard, className)}>
    <div className={style.header}>
      <img src={image ?? wideImgPlaceholder} alt="" />
      <div className={style.logo}>
        <img src={logo ?? zooPlaceholder} alt="" />
      </div>
      <div className={style.tag}>
        <HabitatStatus online={online} liveTalk={liveTalk} />
      </div>
    </div>
    <div className={style.body}>
      <h3>{title}</h3>
      <p>{description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}</p>

      <div className={classnames(style.buttons, { [style.favorite]: onFavoriteClick })}>
        <Link href={encodeURI(`/h/${zooSlug}/${slug}`)}>
          <Button primary label="Enter Habitat" size="large" />
        </Link>
        {onFavoriteClick && (
          <Button
            onClick={() => onFavoriteClick(habitatId)}
            margin={{ horizontal: 'small' }}
          >
            <FontAwesomeIcon icon={faHeart} color="var(--pink)" size="2x" />
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default memo(HabitatCard)
