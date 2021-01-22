import { cloneElement, h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';

import EditButton from '../../../../../components/AdminEditWrappers/EditButton';
// eslint-disable-next-line
import CardEditorLoader from 'async!./CardEditorLoader';

import style from '../../../../../components/AdminEditWrappers/wrapper.scss';

const CardEditor = ({ children, isAdmin, card }) => {
  const childRef = useRef();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const onEditBtnClick = () => {
    setEditModalOpen(true);
  };

  const onClose = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  if (!isAdmin) {
    return children;
  }

  return (
    <div className={style.wrapper}>
      {cloneElement(children, { ref: childRef })}

      <EditButton onClick={onEditBtnClick} />

      <CardEditorLoader
        card={card}
        open={editModalOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default connect(
  // ({ user: { role } }) => ({ isAdmin: role === 'admin' }),
  // TODO: this is used only as mock
  () => ({ isAdmin: true }),
)(CardEditor);
