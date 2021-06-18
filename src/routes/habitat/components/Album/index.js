import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faSpinner,
} from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';
import classnames from 'classnames';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import Loader from 'Components/Loader';
import ErrorModal from 'Components/modals/Error';

import { setAlbumData, appendAlbumData, changeContentVisibility } from './actions';
import MediaContent from './MediaContent';
import ConfirmModal from './ConfirmModal';

import { FEATURED, PHOTOS, PAST_TALKS } from './types';

import style from './style.scss';

const defaultActionModalState = {
  _id: null,
  action: null,
  show: false,
  type: null,
};

const defaultErrorModalState = {
  show: false,
  text: null,
}

const Album = ({
  album,
  tab,
  habitatId,
  setAlbumDataAction,
  appendAlbumDataAction,
  changeContentVisibilityAction,
}) => {
  const [type, setType] = useState(FEATURED);
  const [page, setPage] = useState(1);
  const [actionModalState, setActionModalState] = useState(defaultActionModalState);
  const [errorModalState, setErrorModalState] = useState(defaultErrorModalState);

  const {
    get,
    data,
    loading,
    error,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

  const {
    put,
    response,
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

  const openConfirmActionModal = (mediaContentId, action, type) => setActionModalState({
    action,
    _id: mediaContentId,
    show: true,
    type,
  });

  const cancelConfirmActionModal = () => setActionModalState(defaultActionModalState);

  const confirmActionHandler = async () => {
    const { _id, type, action } = actionModalState;
    const resource = type === 'photos' ? `/admin/photos/${_id}` : `/admin/videos/${_id}`;
    await put(resource, { disabled: action === 'hide' });

    if (response.ok) {
      changeContentVisibilityAction(_id, type, action);
    } else {
      setErrorModalState({ show: true, text: `Error trying to ${action} the selected media content, please try again.`});
    }
    cancelConfirmActionModal();
  }

  const closeErrorModalHandler = () => setErrorModalState(defaultErrorModalState);

  return (
    <>
      <div className={classnames(style.album, { [style.tab]: tab })}>
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
                  disabled,
                  rawURL,
                }) => {
                  const date = new Date(createdAt);
                  return (
                    <MediaContent
                      key={_id}
                      id={_id}
                      image={url}
                      title={format(date, 'MMM Lo, yyyy | h:mmaa')}
                      timestamp={date}
                      disabled={disabled}
                      username={username && `By: ${username}`}
                      accessControlButtonHandler={openConfirmActionModal}
                      type="photos"
                      rawURL={rawURL}
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
                  disabled,
                }) => (
                  <MediaContent
                    key={_id}
                    id={_id}
                    video
                    image={previewURL}
                    title={title}
                    timestamp={new Date(creationDate)}
                    username={username && `Host: ${username}`}
                    accessControlButtonHandler={openConfirmActionModal}
                    disabled={disabled}
                    type="pastTalks"
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
      {actionModalState.show && (
        <ConfirmModal
          action={actionModalState.action}
          onClose={cancelConfirmActionModal}
          onConfirm={confirmActionHandler}
        />
      )}
      {errorModalState.show && (
        <ErrorModal
          text={errorModalState.text}
          onClose={closeErrorModalHandler}
        />
      )}

    </>
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
    changeContentVisibilityAction: changeContentVisibility,
  },
)(Album);
