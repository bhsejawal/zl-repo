import { cloneElement, h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';

import { hasPermission } from '../../Authorize';
import EditButton from '../EditButton';
import TextEditorLoader from '../../async/TextEditorLoader';

import style from '../wrapper.scss';

const TextEditor = ({
  initialText,
  children,
  postToUrl,
  textProp,
  minLen,
  maxLen,
}) => {
  const childRef = useRef();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [text, setText] = useState(initialText);

  // initialText will probably first have "undefined" value
  // also, it will make it possible to change it both from parent and child
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const onEditBtnClick = () => {
    setEditModalOpen(true);
  };

  const onClose = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  const onUpdate = useCallback((newText) => {
    setText(newText);
  }, [setText]);

  if (!hasPermission('habitat:edit-text')) {
    return children(text);
  }

  return (
    <div className={style.wrapper}>
      {cloneElement(children(text), { ref: childRef })}

      <EditButton onClick={onEditBtnClick} />

      {/* TODO: fix loading - it displays empty h4 element */}
      <TextEditorLoader
        initialText={text}
        postToUrl={postToUrl}
        textProp={textProp}
        minLen={minLen}
        maxLen={maxLen}
        open={editModalOpen}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default TextEditor;
