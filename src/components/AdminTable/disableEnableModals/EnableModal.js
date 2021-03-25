import { h } from 'preact';
import BaseModal from './BaseModal';

const EnableModal = ({ entity, onClose, onConfirm }) => (
  <BaseModal
    heading={`Enable ${entity}`}
    text={`Enabling a ${entity.toLowerCase()} will make it accessible by the public.`}
    buttonText="Enable"
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default EnableModal;
