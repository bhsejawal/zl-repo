import { connect } from 'react-redux';
import { setShareModalMediaId } from 'Components/ShareModal/actions';

import MediaContent from './Component';

export default connect(null, {
  onClick: setShareModalMediaId,
})(MediaContent);
