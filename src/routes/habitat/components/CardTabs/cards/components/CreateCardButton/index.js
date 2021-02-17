import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { OutlineButton } from 'Components/Buttons';

import CardEditorLoader from '../../../CardEditor/CardEditorLoader';

import style from './style.scss';

const CreateCardButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const onBtnClick = () => {
    setModalOpen(true);
  };

  const onClose = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <>
      <div className={style.card}>
        <div>
          <OutlineButton onClick={onBtnClick} label="Add Card" />
        </div>
      </div>

      {/* TODO: maybe we should even elevate this to the top level with portals */}
      <CardEditorLoader
        open={modalOpen}
        onClose={onClose}
      />
    </>
  );
};

export default CreateCardButton
