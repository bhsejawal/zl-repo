import { h } from 'preact';
import { lazy, Suspense } from 'preact/compat';
import { connect } from 'react-redux';

import ScheduleCarousel from 'Components/ScheduleCarousel';

import style from './style.scss';

const ChatComponent = lazy(() => import('Components/Chat'));

const Chat = ({ height, width, habitatId }) => (
  <div
    className={style.chat}
    style={{
      height,
      maxHeight: height,
      maxWidth: width,
      width,
    }}
  >
    <ScheduleCarousel />
    <Suspense>
      <ChatComponent channelId={habitatId} />
    </Suspense>
  </div>
);

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Chat);
