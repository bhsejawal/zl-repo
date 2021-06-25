import { memo } from 'preact/compat';

import GlobalsContextProvider from 'Components/GlobalsContextProvider';
import Standalone from './Standalone';

export default memo((props) => (
  // TODO: this should be removed and ShareModal should be refactored
  // We are currently loading socket on this page only to log share
  <GlobalsContextProvider>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Standalone {...props} />
  </GlobalsContextProvider>
));
