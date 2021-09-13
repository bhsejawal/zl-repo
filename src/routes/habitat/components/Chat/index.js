import { h } from 'preact';
import { lazy, Suspense } from 'preact/compat';
import { connect } from 'react-redux';

import style from './style.scss';

const ChatComponent = lazy(() => import('Components/Chat'));

const Chat = ({
  height,
  width,
  habitatId,
  showHeader,
}) => (
  <div
    className={style.chat}
    style={{
      height,
      maxHeight: height,
      maxWidth: width,
      width,
    }}
  >
    <Suspense>
      <ChatComponent channelId={habitatId} showHeader={showHeader} />
    </Suspense>
  </div>
);

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Chat);
