import { h } from 'preact';
import { faLongArrowAltRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScheduleCarousel from '../../../../components/ScheduleCarousel';
import ChatComponent from '../../../../components/Chat';

import style from './style.scss';

const Chat = ({ height, width }) => (
  <div
    className={style.chat}
    style={{
      height,
      maxHeight: height,
      width,
    }}
  >
    <div className={style.chatNavigator}>
      <span>Up Next</span>
      <span>
        <span>Next Habitat&nbsp;</span>
        <FontAwesomeIcon icon={faLongArrowAltRight} />
      </span>
    </div>
    <ScheduleCarousel />
    <ChatComponent />
  </div>
);

export default Chat;
