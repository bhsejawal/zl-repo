import AnimalIcon from '../../../AnimalIcon';

import style from './style.module.scss';

const ChatMessage = ({
  animal,
  color,
  username,
  text,
}) => (
  <div className={style.chatMessageContainer}>
    <AnimalIcon animalIcon={animal} color={color} width={26} />
    <div className={style.messageWrapper}>
      <span className={style.userName}>
        {username}
      </span>
      <span className={style.message}>
        {text}
      </span>
    </div>
  </div>
);

export default ChatMessage;
