import { h } from 'preact';
import { Layer } from 'grommet';

import StatusContent from './StatusContent';

const SuccessModal = ({ text, onClose }) => (
  <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
    <StatusContent type="success" text={text} onClose={onClose} />
  </Layer>
);

export default SuccessModal;
