import { cloneElement, h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';

import EditButton from '../EditButton';
import TextEditorLoader from '../../async/TextEditorLoader';

import style from '../wrapper.scss';

const TextEditor = ({
  isAdmin,
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

  const onEditBtnClick = () => {
    setEditModalOpen(true);
  };

  const onClose = useCallback(() => {
    setEditModalOpen(false);
  }, [setEditModalOpen]);

  const onUpdate = useCallback((newText) => {
    setText(newText);
  }, [setText]);

  if (!isAdmin) {
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

export default connect(
  // ({ user: { role } }) => ({ isAdmin: role === 'admin' }),
  // TODO: this is used only as mock
  () => ({ isAdmin: true }),
)(TextEditor);
