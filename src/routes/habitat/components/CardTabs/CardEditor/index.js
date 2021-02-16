import { cloneElement, h, toChildArray } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';

import { hasPermission } from 'Components/Authorize';

import EditButton from 'Components/AdminEditWrappers/EditButton';
// eslint-disable-next-line
import CardEditorLoader from 'async!./CardEditorLoader';

import style from 'Components/AdminEditWrappers/wrapper.scss';

const CardEditor = ({ children, card }) => {
  const childRef = useRef();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const onEditBtnClick = () => {
    setEditModalOpen(true);
  };

  const onClose = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  if (!hasPermission('habitat:edit-cards')) {
    return (
      <div className={style.wrapper}>
        {children}
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      {toChildArray(children).map((child) => child && (
        cloneElement(child, { ref: childRef })
      ))}

      <EditButton onClick={onEditBtnClick} />

      <CardEditorLoader
        card={card}
        open={editModalOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default CardEditor;
