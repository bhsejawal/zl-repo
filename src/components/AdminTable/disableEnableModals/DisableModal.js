import { h } from 'preact';
import BaseModal from './BaseModal';

const DisableModal = ({ entity, onClose, onConfirm }) => (
  <BaseModal
    heading={`Disable ${entity}`}
    text={`Disabling a ${entity.toLowerCase()} will make it unaccessible by the public.`}
    buttonText="Disable"
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default DisableModal;
