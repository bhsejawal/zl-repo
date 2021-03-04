import { h } from 'preact';
import { Layer } from 'grommet';

import StatusContent from './StatusContent';

export const defaultErrorMsg = (
  <>
    <span>Something went wrong.</span>
    <br />
    <span>Please try again.</span>
  </>
);

const ErrorModal = ({ text = defaultErrorMsg, onClose }) => (
  <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
    <StatusContent type="error" text={text} onClose={onClose} />
  </Layer>
);

export default ErrorModal;
