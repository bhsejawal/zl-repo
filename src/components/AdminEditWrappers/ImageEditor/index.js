import { cloneElement, h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';

import EditButton from '../EditButton';
import ImageEditorLoader from '../../async/ImageEditorLoader';

import style from '../wrapper.scss';

const ImageEditor = ({
  children,
  isAdmin,
  initialImgUrl,
  postToUrl,
  imageProp,
  editBtnPosition = {},
  constraints,
}) => {
  const childRef = useRef();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(initialImgUrl);

  const onEditBtnClick = () => {
    setEditModalOpen(true);
  };

  const onClose = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  const onUpdate = useCallback((newUrl) => {
    setImgUrl(newUrl);
  }, [setImgUrl]);

  if (!isAdmin) {
    return children(imgUrl);
  }

  return (
    <div className={style.wrapper}>
      {cloneElement(children(imgUrl), { ref: childRef })}

      <EditButton style={{ ...editBtnPosition }} onClick={onEditBtnClick} />

      {/* TODO: fix loading - it displays empty h4 element */}
      <ImageEditorLoader
        initialImgUrl={imgUrl}
        postToUrl={postToUrl}
        imageProp={imageProp}
        constraints={constraints}
        open={editModalOpen}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default connect(
  // ({ user: { role } }) => ({ isAdmin: role === 'admin' }),
  // TODO: this is used only as mock
  () => ({ isAdmin: true }),
)(ImageEditor);
