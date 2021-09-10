import { cloneElement, h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';

import EditButton from '../EditButton';
import ImageEditorLoader from '../../async/ImageEditorLoader';
import { hasPermission } from '../../Authorize';
import { useIsMobileSize } from '../../../hooks';

import style from '../wrapper.scss';

const ImageEditor = ({
  children,
  initialImgUrl,
  postToUrl,
  imageProp,
  editBtnPosition = {},
  constraints,
}) => {
  const childRef = useRef();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(initialImgUrl);
  const isMobileSize = useIsMobileSize();

  useEffect(() => {
    setImgUrl(initialImgUrl);
  }, [initialImgUrl]);

  const onEditBtnClick = (evt) => {
    evt.stopPropagation();
    setEditModalOpen(true);
  };

  const onClose = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  const onUpdate = useCallback((newUrl) => {
    setImgUrl(newUrl);
  }, [setImgUrl]);

  if (!hasPermission('habitat:edit-media') || isMobileSize) {
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

export default ImageEditor;
