import { h } from 'preact';
import { connect } from 'react-redux';
import { useState } from 'preact/hooks';
import { formatDistanceToNow } from 'date-fns';
import { lazy, Suspense } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';

import { getIconUrl } from 'Shared/profileIcons';
import AnimalIcon from 'Components/AnimalIcon';

import style from './style.scss';

const Chat = lazy(() => import('Components/Chat'));

const Question = ({
  questionId,
  username,
  color,
  animalIcon,
  content,
  createdAt,
  habitatId,
  comments,
}) => {
  const [expand, setExpand] = useState(false);

  return (
    <div className={style.question}>
      <div className={style.header}>
        <AnimalIcon
          animalIcon={animalIcon.endsWith('.svg') ? animalIcon : getIconUrl(animalIcon)}
          color={color}
          width={35}
        />
        <div className={style.nameWrapper}>
          <span>{username}</span>
          <span>{`${formatDistanceToNow(new Date(createdAt)).replace('about', '')} ago`}</span>
        </div>
      </div>
      <div className={style.body}>
        {content}
      </div>
      <div className={style.footer} onClick={() => setExpand(true)}>
        {!expand && (
          <div className={style.wrapper}>
            <div>
              See Discussion
              &nbsp;
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div>{`${comments} comments`}</div>
          </div>
        )}
        {expand && (
          <>
            <div className={style.commentsContainer}>
              <Suspense>
                <Chat channelId={`${habitatId}-${questionId}`} alternate />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Question);
