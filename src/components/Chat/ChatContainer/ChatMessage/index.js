import { formatDistanceToNowStrict } from 'date-fns';
import { isEmpty } from 'lodash-es';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmilePlus,
  faTrash,
  faFlag,
  faReply,
} from '@fortawesome/pro-regular-svg-icons';
import { Drop, Box } from 'grommet';
import { usePubNub } from 'pubnub-react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getIconUrl } from 'Shared/profileIcons';
import Can from 'Components/Authorize';

import ReactionBar from './ReactionBar';
import ReactionBadge from './ReactionBadge';
import UserBadge from './UserBadge';

import AnimalIcon from '../../../AnimalIcon';

import { useIsHabitatTabbed } from '../../../../hooks';
import { setReplyMessage } from '../../../../redux/actions';

import style from './style.module.scss';

const formatDistanceToNowStrictLocale = {
  xSeconds: '{{count}}s',
  xMinutes: '{{count}}min',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  xMonths: '{{count}}m',
  xYears: '{{count}}y',
};
const shortEnLocale = {
  formatDistance: (token, count) => formatDistanceToNowStrictLocale[token].replace('{{count}}', count),
};

const ChatMessage = ({
  animal,
  color,
  username,
  text,
  timestamp,
  timetoken,
  reactions,
  userId,
  badges,
  channelId,
  onDeleteHandler,
  onReactionHandler,
  onReportHandler,
  onMediaClickHandler,
  alternate,
  media = {},
  reply,
  setReplyMessageAction,
}) => {
  const pubnub = usePubNub();
  const [showActionBar, setShowActionbar] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const isTabbedView = useIsHabitatTabbed();
  const { type, mediaId, src } = media;

  const userReactions = useMemo(() => {
    const userReactions = {};

    Object.keys(reactions).forEach((reaction) => {
      const userR = reactions[reaction].filter(
        ({ uuid }) => (uuid === userId),
      ).shift();

      if (userR) {
        userReactions[reaction] = userR.actionTimetoken;
      }
    });

    return userReactions;
  }, [reactions, userId]);

  const handleReactionBarClose = useCallback(() => {
    setShowReactionBar(false);
    setShowActionbar(false);
  }, [])

  const toggleReaction = useCallback((reaction) => {
    if (!userReactions[reaction]) {
      pubnub.addMessageAction({
        channel: channelId,
        messageTimetoken: timetoken,
        action: {
          type: 'reaction',
          value: reaction,
        },
      });
    } else {
      pubnub.removeMessageAction(
        {
          channel: channelId,
          messageTimetoken: timetoken,
          actionTimetoken: userReactions[reaction],
        },
      );
    }

    onReactionHandler();
    setShowReactionBar(false);
  }, [pubnub, timetoken, userReactions, channelId, onReactionHandler]);

  const initialMessage = useMemo(() => {
    const message = formatDistanceToNowStrict(timestamp, {
      roundingMethod: 'ceil',
      locale: shortEnLocale,
    });
    return message.startsWith('0') ? '1 minute' : message;
  }, [timestamp]);

  const clickMediaHandler = (evt) => {
    evt.stopPropagation();
    onMediaClickHandler(type, mediaId);
  }

  const [messageTime, setMessageTime] = useState(initialMessage);
  const intervalRef = useRef(null);
  const messageContainer = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const timeSinceMsg = formatDistanceToNowStrict(timestamp, {
        roundingMethod: 'ceil',
        locale: shortEnLocale,
      });
      setMessageTime(timeSinceMsg);
    }, 60000);

    return () => clearInterval(intervalRef.current);
  }, [messageTime, timestamp]);

  const scrollHandler = () => {
    document.getElementById(reply.timetoken).scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div
        id={timetoken}
        className={classnames(
          style.chatMessageContainer,
          {
            [style.selected]: showReactionBar || showActionBar,
            [style.alternate]: alternate,
          },
        )}
        ref={messageContainer}
        onMouseEnter={() => setShowActionbar(true)}
        onMouseLeave={() => setShowActionbar(showReactionBar)}
      >
        {!isEmpty(reply) && (
          <div className={style.replyMessageHeader}>
            <AnimalIcon
              animalIcon={reply.animal.endsWith('.svg') ? reply.animal : getIconUrl(reply.animal)}
              color={reply.color}
              width={13}
            />
            <span>
              <b>{reply.username}</b>
            </span>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={scrollHandler}>
              {reply.text}
            </a>
          </div>
        )}
        <div className={style.wrapper}>
          <AnimalIcon
            animalIcon={animal.endsWith('.svg') ? animal : getIconUrl(animal)}
            color={color}
            width={26}
          />
          <div className={style.messageWrapper}>
            <div className={style.headerWrapper}>
              <span className={style.userName}>{username}</span>
              {badges?.length > 0 && (
                <div className={style.userBadgesContainer}>
                  {badges?.map((badge) => <UserBadge badge={badge} />)}
                </div>
              )}
              <span className={style.messageTime}>{` ${messageTime} ago`}</span>

              <div className={classnames(style.actionBar, { [style.hide]: !showActionBar})}>
                <div
                  className={style.actionButton}
                  onClick={() => {
                    setReplyMessageAction(
                      timetoken,
                      username,
                      animal,
                      color,
                      text,
                      channelId,
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faReply} />
                </div>
                <div
                  className={style.actionButton}
                  onClick={() => setShowReactionBar(true)}
                >
                  <FontAwesomeIcon icon={faSmilePlus} />
                </div>
                <Can
                  perform="chat:moderate"
                  yes={() => (
                    // eslint-disable-next-line
                    <div className={style.actionButton} onClick={() => onDeleteHandler(timetoken)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </div>
                  )}
                />
                <Can
                  perform="chat:report"
                  yes={() => (
                    // eslint-disable-next-line
                    <div className={style.actionButton} onClick={() => onReportHandler(timetoken)}>
                      <FontAwesomeIcon icon={faFlag} />
                    </div>
                  )}
                />
              </div>
            </div>
            <span className={style.message}>
              {text}
            </span>
            {mediaId && (
              <div
                className={style.mediaContainer}
                onClick={clickMediaHandler}
              >
                <img src={src} alt={text} />
              </div>
            )}
            <Box direction="row" gap="5px" wrap>
              {reactions && Object.keys(reactions).map((reaction) => (
                <ReactionBadge
                  reaction={reaction}
                  count={reactions[reaction].length}
                  isReaction={userReactions[reaction] ?? false}
                  onClick={toggleReaction}
                />
              ))}
            </Box>
          </div>
        </div>
      </div>
      {messageContainer.current && showReactionBar && (
        <Drop
          align={ !isTabbedView ? { top: 'top', left: 'right' } : { top: 'top', right: 'left' }}
          target={messageContainer.current}
          width={{ min: isTabbedView ? '95%' : '90px', max: '350px' }}
          onClickOutside={handleReactionBarClose}
          onEsc={handleReactionBarClose}
          margin={{ horizontal: isTabbedView ? '10px' : '-5px'}}
          stretch={false}
        >
          <ReactionBar onClick={toggleReaction} />
        </Drop>
      )}
    </>
  );
}

export default connect(({
  user: {
    userId,
  },
}) => ({
  userId,
}),
{ setReplyMessageAction: setReplyMessage })(ChatMessage);
