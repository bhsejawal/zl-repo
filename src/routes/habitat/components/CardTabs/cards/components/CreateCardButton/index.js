import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          <OutlineButton
            onClick={onBtnClick}
            icon={<FontAwesomeIcon icon={faPlus} color="var(--blue)" />}
            label="New"
          />
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
