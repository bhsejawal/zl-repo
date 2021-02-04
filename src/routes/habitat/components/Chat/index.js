import { h } from 'preact';
import { lazy, Suspense } from 'preact/compat';
import { faLongArrowAltRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScheduleCarousel from 'Components/ScheduleCarousel';

import style from './style.scss';

const ChatComponent = lazy(() => {
  if (typeof window !== 'undefined') {
    return import('Components/Chat')
  }

  return null;
});

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
    <Suspense>
      <ChatComponent />
    </Suspense>
  </div>
);

export default Chat;
