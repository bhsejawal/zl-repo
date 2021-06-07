import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';
import classnames from 'classnames';
import useFetch from 'use-http';
import { API_BASE_URL } from 'Shared/fetch';
import Loader from 'Components/Loader';
import { setAlbumData, appendAlbumData } from './actions';
import MediaContent from './MediaContent';
import { FEATURED, PHOTOS, PAST_TALKS } from './types';

import style from './style.scss';

const Album = ({
  album,
  habitatId,
  setAlbumDataAction,
  appendAlbumDataAction,
}) => {
  const [type, setType] = useState(FEATURED);
  const [page, setPage] = useState(1);

  const {
    get,
    data,
    loading,
    error,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

  useEffect(() => {
    if (!error && data) {
      if (page > 1) {
        appendAlbumDataAction(data, type);
      } else {
        setAlbumDataAction(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data, setAlbumDataAction]);

  useEffect(() => {
    if (habitatId) {
      get(`habitats/${habitatId}/album/${type}?page=${page}`);
    }
  }, [type, get, habitatId, page]);

  const onChangeHandler = ({ target: { value }}) => {
    setType(value);
    setPage(1);
  }

  const fetchMore = () => {
    setPage(page + 1);
  }

  return (
    <div className={style.album}>

      <div className="simpleSelect">
        <select onChange={onChangeHandler}>
          <option selected={!type} value={FEATURED}>Featured</option>
          <option selected={type === PHOTOS} value={PHOTOS}>Photos</option>
          <option selected={type === PAST_TALKS} value={PAST_TALKS}>Past Talks</option>
        </select>

        <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
      </div>

      {loading && page === 1 && <Loader fill />}

      {(!loading || page > 1) && album.photos.list.length > 0 && (
        <div className={style.section}>
          {type === FEATURED && (
            <h4>
              Photos
              <button type="button" onClick={() => setType(PHOTOS)}>
                View All
                &nbsp;
                <FontAwesomeIcon icon={faChevronRight} color="var(--blueDark)" />
              </button>
            </h4>
          )}
          <div className={classnames(style.mediaWrapper, {[style.featured]: type === FEATURED })}>
            {
              album.photos.list.map(({
                _id,
                username,
                createdAt,
                url,
              }) => {
                const date = new Date(createdAt);
                return (
                  <MediaContent
                    key={_id}
                    id={_id}
                    image={url}
                    title={format(date, 'MMM Lo, yyyy | h:mmaa')}
                    timestamp={date}
                    username={username && `By: ${username}`}
                  />
                )
              })
            }
          </div>
        </div>
      )}

      {(!loading || page > 1) && album.pastTalks.list.length > 0 && (
        <div className={style.section}>
          {type === FEATURED && (
            <h4>
              Past Talks
              <button type="button" onClick={() => setType(PAST_TALKS)}>
                View All
                &nbsp;
                <FontAwesomeIcon icon={faChevronRight} color="var(--blueDark)" />
              </button>
            </h4>
          )}
          <div className={classnames(style.mediaWrapper, {[style.featured]: type === FEATURED })}>
            {
              album.pastTalks.list.map(({
                _id,
                username,
                previewURL,
                title,
                creationDate,
              }) => (
                <MediaContent
                  key={_id}
                  id={_id}
                  video
                  image={previewURL}
                  title={title}
                  timestamp={new Date(creationDate)}
                  username={username && `Host: ${username}`}
                />
              ))
            }
          </div>
        </div>
      )}

      {type !== FEATURED && album[type].total > album[type].list.length && (
        <button className={style.loadMore} type="button" onClick={fetchMore}>
          {!loading && 'Load More'}
          {loading && (<FontAwesomeIcon icon={faSpinner} spin size="2x" />)}
        </button>
      )}
    </div>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: { _id: habitatId },
      album,
    },
  }) => ({ habitatId, album }),
  {
    setAlbumDataAction: setAlbumData,
    appendAlbumDataAction: appendAlbumData,
  },
)(Album);
