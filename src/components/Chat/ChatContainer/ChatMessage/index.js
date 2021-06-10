import { formatDistanceToNowStrict } from 'date-fns';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { getIconUrl } from 'Shared/profileIcons';
import Can from 'Components/Authorize';
import AnimalIcon from '../../../AnimalIcon';

import style from './style.module.scss';

const ChatMessage = ({
  animal,
  color,
  username,
  text,
  timestamp,
  timetoken,
  onDeleteHandler,
}) => {
  const initialMessage = useMemo(() => {
    const message = formatDistanceToNowStrict(timestamp, { roundingMethod: 'ceil'});
    return message.startsWith('0') ? '1 minute' : message;
  }, [timestamp]);
  const [messageTime, setMessageTime] = useState(initialMessage);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const timeSinceMsg = formatDistanceToNowStrict(timestamp, { roundingMethod: 'ceil'})
      setMessageTime(timeSinceMsg);
    }, 60000);

    return () => clearInterval(intervalRef.current);
  }, [messageTime, timestamp]);

  return (
    <div className={style.chatMessageContainer}>
      <AnimalIcon
        animalIcon={animal.endsWith('.svg') ? animal : getIconUrl(animal)}
        color={color}
        width={26}
      />
      <div className={style.messageWrapper}>
        <div className={style.headerWrapper}>
          <span className={style.userName}>
            {username}
          </span>
          <span className={style.messageTime}>
            {` ${messageTime} ago`}
          </span>
          <Can
              perform="chat:moderate"
              yes={() => (
                // eslint-disable-next-line
                <span className={style.delete} onClick={() => onDeleteHandler(timetoken)}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              )}
          />
        </div>
        <span className={style.message}>
          {text}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
