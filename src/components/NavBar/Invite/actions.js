import { CLOSE_INVITE_MODAL, OPEN_INVITE_MODAL } from './types';

export const openInviteModal = () => ({ type: OPEN_INVITE_MODAL });
export const closeInviteModal = () => ({ type: CLOSE_INVITE_MODAL });
