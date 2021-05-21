import { h } from 'preact';
import { lazy, Suspense } from 'preact/compat';
import { connect } from 'react-redux';

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
    <ScheduleCarousel />
    <Suspense>
      <ChatComponent />
    </Suspense>
  </div>
);

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Chat);
